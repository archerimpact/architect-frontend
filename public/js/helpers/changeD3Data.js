import * as d3 from 'd3';
import * as utils from './utils.js';

import { 
  ENTITY,
  GROUP,
  GROUP_HULL,
  DOCUMENT
} from './typeConstants.js';

export function getInverseAction(action) {
  // Implement for undo
  
}

// Multi-node manipulation methods
export function deleteSelectedNodes() {
  var select = this.svg.selectAll('.node.selected');
  select.each((d) => {
    for (var i = this.adjacencyMatrix.length-1; i >=0; i--) {
      if (this.adjacencyMatrix[i][i].data.id === d.id) { 
        this.deleteNode(i);
        if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
      }
    }
  })

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
}

// Delete selected links
export function deleteSelectedLinks() {
  var select = this.svg.selectAll('.link.selected');

  select.each((d) => {
    let i = this.idToIndex[d.source.id];
    let j = this.idToIndex[d.target.id];
    this.deleteLink(i, j);
  })

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.node.classed("selected", false)
  this.update();
}

export function addLink(source, target) {
  // this.reloadIdToIndex();
  const i = this.idToIndex[source.id];
  const j = this.idToIndex[target.id];

  this.createLink(i, j);
  this.update();
}

export function selectLink(source, target) {
  const linkId = this.linkedById[source.id + ',' + target.id] || this.linkedById[target.id + ',' + source.id];
  this.link.filter((d) => { return d.id === linkId; })
    .call(this.styleLink, true);
}

export function addNodeToSelected(selection, event=null) {
  let node = this.createNode(ENTITY, event)
  // For each node selected, create a link attaching the new node to the selected node
  selection
    .each((d) => {
      let i = this.adjacencyMatrix.length-1;
      let j = this.idToIndex[d.id];
      this.createLink(i, j);
    });

  // Remove highlighting of all nodes and links 
  this.node.classed('selected', false);
  this.link.call(this.styleLink, false);
  this.nodeSelection = {};
  this.update(event);
  this.fillGroupNodes();
}

export function toggleDocumentView() {
  this.documentsShown ? this.hideDocumentNodes() : this.showHiddenDocuments();
  this.update();
}

export function hideDocumentNodes() {
  var select = this.svg.selectAll('.node')
    .filter((d) => {
      if (d.type === DOCUMENT) { this.hideNode(this.idToIndex[d.id]); }
    });

  this.documentsShown = false;
}

export function showHiddenDocuments() {
  for (var i = 0; i < this.adjacencyMatrix.length; i++) {
    if (this.adjacencyMatrix[i][i].data.type === DOCUMENT) { this.displayNode(i); }
  }

  this.documentsShown = true;
}

export function groupSelectedNodes() {
  var select = this.svg.selectAll('.node.selected');
  if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

  const group = [];

  select.each((d) => { 
    if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
    group.push(this.idToIndex[d.id]); 
  });

  this.createGroup(group);

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

export function ungroupSelectedGroups() {
  var select = this.svg.selectAll('.node.selected')
    .filter((d) => {
      for (var i = this.adjacencyMatrix.length-1; i >=0; i--) {
        if (this.adjacencyMatrix[i][i].data.id === d.id && utils.isGroup(d)) { this.ungroup(i); }
      }

      if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
    });

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.node.classed('selected', false);
  this.link.call(this.styleLink, false);
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

export function expandGroups(select, centered = false) {
  select.each((d) => { this.expandGroup(this.idToIndex[d.id]); });
}

export function toggleGroupView(id) {
  /* switch between viewing the group in expanded and collapsed state.
    When expanded, the nodes in the group will have a hull polygon encircling it */
  let index = this.idToIndex[id]

  if (!utils.isGroup(this.adjacencyMatrix[index][index].data)) { return; }
  if (this.expandedGroups[id]) {
    this.collapseGroup(index);
    this.hulls.map((hull, i) => {
      if (hull.groupId === id) {
        this.hulls.splice(i, 1); // remove this hull from the global list of hulls
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

  var sameGroups = {};
  var alreadyGrouped = []
  var group = 0;
  for (var i = 0; i < this.links.length; i++) {
    if (this.links[i].type === 'possibly_same_as') {
      var newGroup = true;
      for (var key in sameGroups) {
        if (sameGroups[key].indexOf(this.idToIndex[this.links[i].source.id]) >= 0) {
          newGroup = false;
          if (sameGroups[key].indexOf(this.idToIndex[this.links[i].target.id]) < 0) {
            sameGroups[key].push(this.idToIndex[this.links[i].target.id]);
          }
        }
        else if (sameGroups[key].indexOf(this.idToIndex[this.links[i].target.id]) >= 0) {
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

  for (var key in sameGroups) {
    this.createGroup(sameGroups[key]);
  }

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

//Hull functions
export function createHull(groupId, group) {
  var vertices = [];
  var offset = 30; //arbitrary, the size of the node radius

  for (var a = 0; a < group.length; a++) {
    let i = group[a]
    if (utils.isVisibleNode(this.adjacencyMatrix[i][i].state)) {
      let d = this.adjacencyMatrix[i][i].data;     
      vertices.push(
        [d.x + offset, d.y + offset], // creates a buffer around the nodes so the hull is larger
        [d.x - offset, d.y + offset],
        [d.x - offset, d.y - offset],
        [d.x + offset, d.y - offset]
      );   
    }
  }

  return { groupId: groupId, path: d3.geom.hull(vertices), type: GROUP_HULL }; //returns a hull object
}

export function calculateAllHulls() {
  /* calculates paths of all hulls in the global hulls list */
  this.hulls.slice().map((hull, i) => {
    if (this.idToIndex[hull.groupId]) {
      let group = this.getGroupMembers(this.idToIndex[hull.groupId]);
      for (var a = 0; a < group.length; a++) {
        let subGroup = this.getGroupMembers(group[a]);
        if (subGroup.length > 0 
          && this.expandedGroups[this.indexToId[group[a]]]) { 
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
