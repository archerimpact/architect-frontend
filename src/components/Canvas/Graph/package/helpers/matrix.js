import {BELONGS_TO, DISPLAYED, GROUP_MEMBER, HIDDEN, NONEXISTENT} from "./matrixConstants.js";

import {GROUP} from "./constants.js";
import * as utils from "./utils.js";

export function setMatrix(nodes, links, byIndex = false) {
    let numNodes = nodes.length;
    let adjacencyMatrix = new Array(numNodes);
    for (let i = 0; i < numNodes; i++) {
        adjacencyMatrix[i] = new Array(numNodes);
        adjacencyMatrix[i][i] = {state: DISPLAYED, data: nodes[i]}
        for (let j = 0; j < numNodes; j++) {
            if (i === j) { continue; }
            adjacencyMatrix[i][j] = {state: NONEXISTENT, data: null};
        }
    }

    this.adjacencyMatrix = adjacencyMatrix;
    this.reloadIdToIndex();
    let source, target;

    for (let i = 0; i < links.length; i++) {
        if (byIndex) { // byIndex is true when the link.source and link.target refer to the index of the node in nodes
            source = links[i].source;
        } else if (links[i].source.id) { // the links have already been mapped to the nodes by d3
            links[i].source = source = this.idToIndex[links[i].source.id];
        } else { // the links have not already been mapped to the nodes
            links[i].source = source = this.idToIndex[links[i].source];
        } 

        if (byIndex) {
            target = links[i].target
        } else if (links[i].target.id) {
            links[i].target = target = this.idToIndex[links[i].target.id];
        } else {
            links[i].target = target = this.idToIndex[links[i].target];
        }

        if (source === undefined || target === undefined) continue; //TODO: offline mode hack
        this.adjacencyMatrix[source][target] = {state: DISPLAYED, data: links[i]};
    }
}

export function addToMatrix(centerid, nodes, links) {
    this.reloadIdToIndex();

    let numNodes = nodes.length;
    for (let j = 0; j < numNodes; j++) {
        if (this.idToIndex[nodes[j].id] === null || this.idToIndex[nodes[j].id] === undefined) {
            utils.addRowColumn(this.adjacencyMatrix);
            this.adjacencyMatrix[this.adjacencyMatrix.length - 1][this.adjacencyMatrix.length - 1] = {
                state: DISPLAYED,
                data: nodes[j]
            };
        }
    }

    this.reloadIdToIndex();

    const numLinks = links.length;
    let num = 0;
    let sourceIndex, targetIndex;
    for (let i = 0; i < numLinks; i++) {
        // Determine whether or not the links have already been mapped to the nodes by d3
        links[i].source = sourceIndex = (links[i].source.id) ? this.idToIndex[links[i].source.id] : this.idToIndex[links[i].source];
        links[i].target = targetIndex = (links[i].target.id) ? this.idToIndex[links[i].target.id] : this.idToIndex[links[i].target];

        if (this.adjacencyMatrix[sourceIndex][targetIndex].state === NONEXISTENT) {
            const source = this.adjacencyMatrix[sourceIndex][sourceIndex].data;
            const target = this.adjacencyMatrix[targetIndex][targetIndex].data;
            let distance = 10 + num;
            if (!source.px && target.px) {
                source.x = (target.px >= this.width / 2) ? (target.px + distance) : (target.px - distance);
                source.y = (target.py >= this.height / 2) ? (target.py + distance) : (target.py - distance);
                target.fixedTransition = target.fixed = true;
            } else if (!target.px && source.px) {
                target.x = (source.px >= this.width / 2) ? (source.px + distance) : (source.px - distance);
                target.y = (source.py >= this.height / 2) ? (source.py + distance) : (source.py - distance);
                source.fixed = source.fixedTransition = true;
            }

            num += 10;
            links[i].source = source;
            links[i].target = target;
            this.adjacencyMatrix[sourceIndex][targetIndex] = {state: DISPLAYED, data: links[i]};
        }
    }

    this.update(null, 20);
}

export function matrixToGraph() {
    this.links.length = 0;
    this.nodes.length = 0;
    for (let i = 0; i < this.adjacencyMatrix.length; i++) {
        if (this.adjacencyMatrix[i][i].state === DISPLAYED) {
            this.nodes.push(this.adjacencyMatrix[i][i].data);
            for (let j = 0; j < this.adjacencyMatrix.length; j++) {
                if (i === j) { continue; }
                if (this.adjacencyMatrix[i][j].state === DISPLAYED) {
                    let link = this.adjacencyMatrix[i][j].data;
                    if (link) {
                        this.links.push(link);
                    }
                }
            }
        }
    }

    this.reloadIdToIndex();
}

export function displayNode(i) {
    if (this.adjacencyMatrix[i][i].state === HIDDEN) {
        this.adjacencyMatrix[i][i].state = DISPLAYED;
        for (let j = 0; j < this.adjacencyMatrix.length; j++) {
            if (i === j) { continue; } // don't do anything if it's a node
            this.displayLink(i, j);
            this.displayLink(j, i);
        }
    }
}

export function createNode(type, name, event = null) {
    utils.addRowColumn(this.adjacencyMatrix);
    let id = this.globalnodeid--;
    let newNode;
    const nodeName = (!name) ? `Node ${-1 * id}` : name;
    if (event) {
        const xPos = (event.x - this.zoomTranslate[0]) / this.zoomScale;
        const yPos = (event.y - this.zoomTranslate[1]) / this.zoomScale;
        newNode = {id: id, name: nodeName, type: type, x: xPos, y: yPos, fixed: true};
    } else {
        newNode = {id: id, name: nodeName, type: type};
    }

    this.adjacencyMatrix[this.adjacencyMatrix.length - 1][this.adjacencyMatrix.length - 1] = {
        state: DISPLAYED,
        data: newNode
    };

    return newNode;
}

export function displayLink(i, j) {
    if (this.adjacencyMatrix[i][j].state === HIDDEN && this.adjacencyMatrix[i][i].state === DISPLAYED && this.adjacencyMatrix[j][j].state === DISPLAYED) {
        this.adjacencyMatrix[i][j].state = DISPLAYED;
    }
}

export function createLink(i, j) {
    // let source = this.adjacencyMatrix[i][i].data;
    // let target = this.adjacencyMatrix[j][j].data;
    let link = {
        id: this.globallinkid--,
        type: "Custom",
        source: this.adjacencyMatrix[i][i].data,
        target: this.adjacencyMatrix[j][j].data
    }

    this.adjacencyMatrix[i][j] = {state: DISPLAYED, data: link};
    return link;
}

export function deleteNode(i) {
    utils.removeColumn(this.adjacencyMatrix, i);
}

export function deleteLink(i, j) {
    if (this.adjacencyMatrix[i][j].state === DISPLAYED) {
        this.adjacencyMatrix[i][j].data = null;
        this.adjacencyMatrix[i][j].state = NONEXISTENT;
    }
}

export function hideNode(i) {
    if (this.adjacencyMatrix[i][i].state === DISPLAYED) {
        this.adjacencyMatrix[i][i].state = HIDDEN;
        for (let j = 0; j < this.adjacencyMatrix.length; j++) {
            if (i === j) { continue; } // don't do anything if it's a node
            this.hideLink(i, j);
            this.hideLink(j, i);
        }
    }
}

export function hideLink(i, j) {
    if (this.adjacencyMatrix[i][j].state === DISPLAYED) {
        this.adjacencyMatrix[i][j].state = HIDDEN;
    }
}

export function setGroupMembers(i, group) {
    for (let a = 0; a < group.length; a++) {
        this.adjacencyMatrix[i][group[a]].state = GROUP_MEMBER;
    }
}

export function getGroupMembers(i) {
    let group = [];
    for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        if (i === j) { continue; }
        if (this.adjacencyMatrix[i][j].state === GROUP_MEMBER) {
            group.push(j);
        }
    }

    return group;
}

export function createGroup(group, name = null) {
    this.createNode(GROUP, name);
    let i = this.adjacencyMatrix.length - 1;
    this.setGroupMembers(i, group);
    for (let a = 0; a < group.length; a++) {
        this.copyLinks(i, group[a]);
        this.adjacencyMatrix[group[a]][i].state = BELONGS_TO;
        this.adjacencyMatrix[group[a]][group[a]].data.group = this.adjacencyMatrix[i][i].data.id;
    }

    for (let a = 0; a < group.length; a++) {
        this.hideNode(group[a]);
    }
}

export function ungroup(i) {
    const group = this.getGroupMembers(i);
    for (let a = 0; a < group.length; a++) {
        delete this.adjacencyMatrix[group[a]][group[a]].data.group;
        this.displayNode(group[a]);
    }

    this.deleteNode(i);
}

export function expandGroup(i) {
    const group = this.getGroupMembers(i);
    for (let a = 0; a < group.length; a++) {
        let groupX = this.adjacencyMatrix[i][i].data.x;
        let groupY = this.adjacencyMatrix[i][i].data.y;
        let d = this.adjacencyMatrix[group[a]][group[a]].data

        if (d.fixed && d.centroidx && d.centroidy) {
            d.px += (d.centroidx > groupX) ? d.centroidx - groupX : groupX - d.centroidx;
            d.py += (d.centroidy > groupY ? d.centroidy - groupY : groupY - d.centroidy);
        }

        d.centroidx = groupX;
        d.centroidy = groupY;
        this.displayNode(group[a]);
    }

    this.hideNode(i);
}

export function collapseGroup(i) {
    const group = this.getGroupMembers(i);
    for (let a = 0; a < group.length; a++) {
        if (this.getGroupMembers(group[a]).length > 0 && this.adjacencyMatrix[group[a]][group[a]].state === HIDDEN) {
            this.collapseGroup(group[a]);
        }

        this.hideNode(group[a]);
        this.copyLinks(i, group[a]);
    }

    this.displayNode(i);
}

export function getParent(i) {
    for (let j = 0; j < this.adjacencyMatrix.length; j++) {
        if (this.adjacencyMatrix[i][j].state === BELONGS_TO) {
            return j;
        }
    }

    return null;
}

export function copyLinks(i, j) {
    for (let k = 0; k < this.adjacencyMatrix.length; k++) {
        if (i === k || j === k) { continue; } //don't do anything if the k is just the group node!
        
        if (utils.isMorePreferredState(this.adjacencyMatrix[j][k].state, this.adjacencyMatrix[i][k].state)) {
            this.adjacencyMatrix[i][k] = {
                state: this.adjacencyMatrix[j][k].state,
                data: this.createLink(i, k)
            };
        }

        if (utils.isMorePreferredState(this.adjacencyMatrix[k][j].state, this.adjacencyMatrix[k][i].state)) {
            this.adjacencyMatrix[k][i] = {
                state: this.adjacencyMatrix[k][j].state,
                data: this.createLink(k, i)
            };
        }
    }
}