import * as d3 from "d3";
import * as aesthetics from "./aesthetics.js";
import * as constants from "./constants.js";
import * as selection from "./selection.js";
import * as utils from "./utils.js";
import { GROUP_HULL } from "./constants.js";

export function getInverseAction(action) {
    // Implement for undo
}

// ================
// UPDATING OBJECTS
// ================

export function deleteSelectedObjects() {
    deleteSelectedNodes.bind(this)();
    deleteSelectedLinks.bind(this)();
    aesthetics.resetObjectHighlighting.bind(this)();
    this.update();
}

// ==============
// UPDATING LINKS
// ==============

export function addLink(source, target, linkType=null) {
    const i = this.idToIndex[source.id];
    const j = this.idToIndex[target.id];
    source.totalLinks = parseInt(source.totalLinks, 10) + 1;
    target.totalLinks = parseInt(target.totalLinks, 10) + 1;

    this.createLink(i, j, linkType);
    this.update();
}

export function deleteSelectedLinks() {
    let selected = selection.selectSelectedLinks();
    if (selected.empty()) return;
    selected.each((l) => {
        let i = this.idToIndex[l.source.id];
        let j = this.idToIndex[l.target.id];
        this.deleteLink(i, j);
    })
}

// ==============
// UPDATING NODES
// ==============

export function addNodeToSelected(event=null) {
    let selected = selection.selectSelectedNodes();
    if (selected.empty()) return;
    // For each node selected, create a link attaching the new node to the selected node
    selected.each((d) => {
        let i = this.adjacencyMatrix.length - 1;
        let j = this.idToIndex[d.id];
        this.createLink(i, j);
    });

    aesthetics.resetObjectHighlighting.bind(this)();
    this.update(event);
    this.fillGroupNodes();
}

export function deleteSelectedNodes() {
    let selected = selection.selectSelectedNodes();
    if (selected.empty()) return;
    selected.each((d) => {
        for (let i = this.adjacencyMatrix.length - 1; i >= 0; i--) {
            if (this.adjacencyMatrix[i][i].data.id === d.id) {
                this.deleteNode(i);
                if (d === this.hoveredNode) {
                    this.deletingHoveredNode = true;
                }
            }
        }
    });
}

export function expandSelectedNodes() {
    let selected = selection.selectSelectedNodes();
    selected.each((d) => {
        this.expandNodeFromData(d);
    });
}

// ============
// HIDING NODES
// ============

export function toggleTypeView(type) {
    this.typesShown[type] ? this.hideTypeNodes(type) : this.showHiddenType(type);
    this.update();
}

export function hideTypeNodes(type) {
    // let select = this.svg.selectAll('.node')
    //   .filter((d) => {
    //     if (d.type === type) { this.hideNode(this.idToIndex[d.id]); }
    //   });

    this.typesShown[type] = false;
}

export function showHiddenType(type) {
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
        if (this.adjacencyMatrix[i][i].data.type === type) {
            this.displayNode(i);
        }
    }

    this.typesShown[type] = true;
}

// ==============
// GROUPING NODES
// ==============

export function groupSelectedNodes() {
    let selected = selection.selectSelectedNodes();
    // Exit if nothing or only one node is selected
    if (selected.empty() || selected[0].length <= 1) return;

    const group = [];
    selected.each((d) => {
        if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
        group.push(this.idToIndex[d.id]);
    });

    this.createGroup(group);
    aesthetics.resetObjectHighlighting.bind(this)();
    this.update();
    this.fillGroupNodes();
}

export function ungroupSelectedGroups() {
    let selected = selection.selectSelectedNodes();
    if (selected.empty()) return;
    selected.filter((d) => {
        for (let i = this.adjacencyMatrix.length-1; i >=0; i--) {
            if (this.adjacencyMatrix[i][i].data.id === d.id && utils.isGroup(d)) { this.ungroup(i); }
        }
    
        if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
    });

    aesthetics.resetObjectHighlighting.bind(this)();
    this.update();
    this.fillGroupNodes();
}

export function expandGroups(selected, centered=false) {
    selected.each((d) => {
        this.expandGroup(this.idToIndex[d.id]);
    });

    aesthetics.resetObjectHighlighting.bind(this)();
}

export function toggleGroupView(id) {
    // Switch between viewing the group in expanded and collapsed state.
    // When expanded, the nodes in the group will have a hull polygon encircling it
    let index = this.idToIndex[id]

    if (!utils.isGroup(this.adjacencyMatrix[index][index].data)) { return; }

    if (this.expandedGroups[id]) {
        this.collapseGroup(index);
        this.hulls.forEach((hull, i) => {
            if (hull.groupId === id) {
                // Remove this hull from the global list of hulls
                this.hulls.splice(i, 1);
            }
        });

        this.expandedGroups[id] = false;
    } else {
        this.expandGroup(index);
        const group = this.getGroupMembers(index);
        this.hulls.push(this.createHull(id, group));
        this.expandedGroups[id] = true;
    }

    this.hoveredNode = null;
    this.update();
    this.fillGroupNodes();
}

export function groupSame() {
    /* Groups all the nodes that are connected to each other with possibly_same_as */
    let sameGroups = {};
    // let alreadyGrouped = []
    let group = 0;
    for (let i = 0; i < this.links.length; i++) {
        if (utils.isPossibleLink(this.links[i].type)) {
            let newGroup = true;
            for (let key in sameGroups) {
                if (sameGroups[key].indexOf(this.idToIndex[this.links[i].source.id]) >= 0) {
                    newGroup = false;
                    if (sameGroups[key].indexOf(this.idToIndex[this.links[i].target.id]) < 0) {
                        sameGroups[key].push(this.idToIndex[this.links[i].target.id]);
                    }
                } else if (sameGroups[key].indexOf(this.idToIndex[this.links[i].target.id]) >= 0) {
                    newGroup = false;
                    sameGroups[key].push(this.idToIndex[this.links[i].source.id]);
                }
            }
            
            if (newGroup) {
                sameGroups[group] = [this.idToIndex[this.links[i].target.id], this.idToIndex[this.links[i].source.id]];
                group += 1;
            }
        }
    }

    for (let k in sameGroups) {
        this.createGroup(sameGroups[k], this.nodes[sameGroups[k][0]].name);
    }

    aesthetics.resetObjectHighlighting.bind(this)();
    this.update();
    this.fillGroupNodes();
}

// =============
// HULL CREATION
// =============

export function createHull(groupId, group) {
    let vertices = [];
    const offset = constants.NODE_RADIUS;

    for (let a = 0; a < group.length; a++) {
        let i = group[a]
        if (utils.isVisibleNode(this.adjacencyMatrix[i][i].state)) {
            let d = this.adjacencyMatrix[i][i].data;
            vertices.push(
                [d.x + offset, d.y + offset],
                [d.x - offset, d.y + offset],
                [d.x - offset, d.y - offset],
                [d.x + offset, d.y - offset]
            );
        }
    }

    // Returns a hull object
    return {groupId: groupId, path: d3.geom.hull(vertices), type: GROUP_HULL};
}

export function calculateAllHulls() {
    // Calculates paths of all hulls in the global hulls list
    this.hulls.slice().forEach((hull, i) => {
        if (this.idToIndex[hull.groupId]) {
            let group = this.getGroupMembers(this.idToIndex[hull.groupId]);
            for (let a = 0; a < group.length; a++) {
                let subGroup = this.getGroupMembers(group[a]);
                if (subGroup.length > 0 && this.expandedGroups[this.indexToId[group[a]]]) {
                    group = group.concat(subGroup);
                }
            }

            this.hulls[i] = this.createHull(hull.groupId, group);
        } else {
            delete this.hulls.splice(this.hulls.indexOf(hull), 1);
        }
    });
}

export function drawHull(d) {
    return this.curve(d.path);
}
