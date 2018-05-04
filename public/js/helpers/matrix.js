import { 
  NONEXISTENT, 
  DISPLAYED, 
  HIDDEN, 
  GROUP_MEMBER,
  BELONGS_TO
} from './matrixConstants.js';

import { 
  ENTITY, 
  GROUP,
  DOCUMENT
} from './typeConstants.js';

import * as utils from './utils.js';

export function setMatrix(nodes, links) {
  var numNodes = nodes.length;
  var adjacencyMatrix = new Array(numNodes);
  for (var i = 0; i < numNodes; i++) {
    adjacencyMatrix[i] = new Array(numNodes);
    adjacencyMatrix[i][i] = {state: DISPLAYED, data: nodes[i]}
    for (var j = 0; j < numNodes; j++) {
      if (i === j) { continue; }
      adjacencyMatrix[i][j] = {state: NONEXISTENT, data: null};
    }
  }
  for (var i = 0; i < links.length; i++) {
    adjacencyMatrix[links[i].source][links[i].target] = {state: DISPLAYED, data: links[i]};
  }
  this.adjacencyMatrix = adjacencyMatrix;
}

export function addToMatrix(centerid, nodes, links) {
  var originalNodes = this.adjacencyMatrix.length;
  var numNodes = nodes.length;
  for (var i = 0; i < numNodes; i++) {
    if (this.globalNodes.indexOf(nodes[i]) < 0) {
      utils.addRowColumn(this.adjacencyMatrix);
      this.adjacencyMatrix[this.adjacencyMatrix.length - 1][this.adjacencyMatrix.length - 1] = {
        state: DISPLAYED,
        data: nodes[i]
      }
    }
  }
  // CHECK FOR REPEATS
  var numLinks = links.length;
  for (var i = 0; i < numLinks; i++) {
    var sourceIndex = links[i].source + originalNodes;
    var targetIndex = links[i].target + originalNodes;
    if (this.adjacencyMatrix[sourceIndex][targetIndex].state === NONEXISTENT) {
      links[i].source = sourceIndex;
      links[i].target = targetIndex;
      this.adjacencyMatrix[sourceIndex][targetIndex].state = DISPLAYED;
    }
  }
  this.update();
}

export function matrixToGraph() {
  this.links.length = 0;
  this.nodes.length = 0;
  for (var i = 0; i < this.adjacencyMatrix.length; i++) {
    if (this.adjacencyMatrix[i][i].state === DISPLAYED) { 
      this.nodes.push(this.adjacencyMatrix[i][i].data); 
      for (var j = 0; j < this.adjacencyMatrix.length; j++) {
        if (i === j) { continue; }
        if (this.adjacencyMatrix[i][j].state === DISPLAYED) { 
          let link = this.adjacencyMatrix[i][j].data;
          if (link) { this.links.push(link); } 
        }
      }
    }
  }
  this.reloadIdToIndex();
}

export function displayNode(i) {
  if (this.adjacencyMatrix[i][i].state === HIDDEN) {
    this.adjacencyMatrix[i][i].state = DISPLAYED;
    for (var j = 0; j < this.adjacencyMatrix.length; j++) {
      if (i === j) { continue; } // don't do anything if it's a node
      this.displayLink(i, j);
      this.displayLink(j, i);
    }   
  }
}

export function createNode(type, event=null) {
  utils.addRowColumn(this.adjacencyMatrix);

  let id = this.globalnodeid--;
  let newNode;
  if (event) {
    const xPos = (event.x - this.zoomTranslate[0]) / this.zoomScale;
    const yPos = (event.y - this.zoomTranslate[1]) / this.zoomScale;
    newNode = { id: id, name: `Node ${-1 * id}`, type: type, x: xPos, y: yPos, fixed: true};
  } else {
    newNode = { id: id, name: `Node ${-1 * id}`, type: type };
  }
  this.adjacencyMatrix[this.adjacencyMatrix.length-1][this.adjacencyMatrix.length-1] = {
    state: DISPLAYED,
    data: newNode
  }
  return newNode;
}

export function displayLink(i, j) {
  if (this.adjacencyMatrix[i][j].state === HIDDEN && this.adjacencyMatrix[i][i].state === DISPLAYED && this.adjacencyMatrix[j][j].state === DISPLAYED) {
    this.adjacencyMatrix[i][j].state = DISPLAYED;
  }
}

export function createLink(i, j) {
  let source = this.adjacencyMatrix[i][i].data;
  let target = this.adjacencyMatrix[j][j].data;
  let link = { id: this.globallinkid--, type: "Custom", source: this.adjacencyMatrix[i][i].data, target: this.adjacencyMatrix[j][j].data}
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
    for (var j = 0; j < this.adjacencyMatrix.length; j++) {
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
  for (var a = 0; a < group.length; a++) {
    this.adjacencyMatrix[i][group[a]].state = GROUP_MEMBER;
  }
}

export function getGroupMembers(i) {
  var group = [];
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    if (i === j) { continue; }
    if (this.adjacencyMatrix[i][j].state === GROUP_MEMBER) { group.push(j); }
  }
  return group;
}

export function createGroup(group) {
  this.createNode(GROUP);
  let i = this.adjacencyMatrix.length-1;
  this.setGroupMembers(i, group);
  for (var a = 0; a < group.length; a++) {
    this.copyLinks(i, group[a]);
    this.adjacencyMatrix[group[a]][i].state = BELONGS_TO;
    this.adjacencyMatrix[group[a]][group[a]].data.group = this.adjacencyMatrix[i][i].data.id;
  }
  for (var a = 0; a < group.length; a++) { this.hideNode(group[a]); }
}

export function ungroup(i) {
  const group = this.getGroupMembers(i);
  for (var a = 0; a < group.length; a++) { 
    delete this.adjacencyMatrix[group[a]][group[a]].data.group;
    this.displayNode(group[a]); 
  }
  this.deleteNode(i); 
} 

export function expandGroup(i) {
  const group = this.getGroupMembers(i);
  for (var a = 0; a < group.length; a++) {
    let d = this.adjacencyMatrix[group[a]][group[a]].data
    d.centroidx = this.adjacencyMatrix[i][i].data.fixedX = this.adjacencyMatrix[i][i].data.x;
    d.centroidy = this.adjacencyMatrix[i][i].data.fixedY = this.adjacencyMatrix[i][i].data.y;
    this.displayNode(group[a]); 
  }
  this.hideNode(i);  
} 

export function collapseGroup(i) {
  this.displayNode(i);
  const group = this.getGroupMembers(i);
  for (var a = 0; a < group.length; a++) {
    this.hideNode(group[a]);
    if (group[a] === i) { debugger;}
  }
}

export function copyLinks(i, j) {
  for (var k = 0; k < this.adjacencyMatrix.length; k++) {
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