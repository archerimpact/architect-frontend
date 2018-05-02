import { 
  NONEXISTENT, 
  TO_REMOVE, 
  REMOVED, 
  TO_ADD, 
  TO_ADD_LINK,
  DISPLAYED, 
  TO_HIDE, 
  TO_UNHIDE,
  HIDDEN, 
  GROUP_MEMBER,
  TO_ADD_GROUP,
  TO_UNGROUP,
  TO_TOGGLE_GROUP,
  DISPLAYED_GROUP,
  TO_COLLAPSE_GROUP
} from './matrixConstants.js';

import { 
  ENTITY, 
  GROUP
} from './typeConstants.js';

import * as utils from './utils.js';

export function setMatrix(nodes, links) {
    this.globalNodes = nodes.slice();
    this.globalLinks = {};
    var numNodes = nodes.length;
    var adjacencyMatrix = new Array(numNodes);
    for (var i = 0; i < numNodes; i++) {
      adjacencyMatrix[i] = new Array(numNodes);
      for (var j = 0; j < numNodes; j++) {
        adjacencyMatrix[i][j] = 0;
        if (i === j) { adjacencyMatrix[i][j] = DISPLAYED }
      }
    }
    for (var i = 0; i < links.length; i++) {
      adjacencyMatrix[links[i].source][links[i].target] = DISPLAYED;
      var key = links[i].source + '-' + links[i].target;
      this.globalLinks[key] = links[i];
    }
    this.adjacencyMatrix = adjacencyMatrix;

    // // Example of deleting node 3
    // var idx = 3;

    // // Option a: Deleting row/column
    // // for(var i = 0 ; i < adjacencyMatrix.length ; i++)
    // // {
    // //    adjacencyMatrix[i].splice(idx,1);
    // // }
    // // adjacencyMatrix.splice(idx, 1);

    // // Option b: Deleting by setting to -1
    // adjacencyMatrix[idx][idx] = -1;

  }

export function addToMatrix(centerid, nodes, links) {
  var originalNodes = this.adjacencyMatrix.length;
  var numNodes = nodes.length;
  for (var i = 0; i < numNodes; i++) {
    if (this.globalNodes.indexOf(nodes[i]) < 0) {
      utils.addRowColumn(this.adjacencyMatrix);
      this.adjacencyMatrix[this.adjacencyMatrix.length - 1][this.adjacencyMatrix.length - 1] = DISPLAYED;
      this.nodes.push(nodes[i]);
      this.globalNodes.push(nodes[i]);
    }
  }

  // CHECK FOR REPEATS
  var numLinks = links.length;
  for (var i = 0; i < numLinks; i++) {
    var sourceIndex = links[i].source + originalNodes;
    var targetIndex = links[i].target + originalNodes;
    var key = sourceIndex + '-' + targetIndex;
    if (!this.globalLinks.hasOwnProperty(key)) {
      links[i].source = sourceIndex;
      links[i].target = targetIndex;
      this.globalLinks[key] = links[i];
      this.links.push(links[i]);
      this.adjacencyMatrix[sourceIndex][targetIndex] = DISPLAYED;
    }
  }
  this.update();
}

export function matrixToGraph(event=null) {
  //for node manipulation
  for (var i = 0; i < this.adjacencyMatrix.length; i++) {

    if (this.adjacencyMatrix[i][i] === TO_ADD) {
      this.addNode(i, event);
    }

    if (this.adjacencyMatrix[i][i] === TO_ADD_LINK) {
      this.matrixAddLink(i);
    }

    else if (this.adjacencyMatrix[i][i] === TO_REMOVE) {
      this.removeNodeFromDOM(i, TO_REMOVE);
    } 

    else if (this.adjacencyMatrix[i][i] === TO_HIDE) {
      this.removeNodeFromDOM(i, TO_HIDE);
    }
    else if (this.adjacencyMatrix[i][i] === TO_UNHIDE) {
      this.unhideNode(i);
    }

    else if (this.adjacencyMatrix[i][i] === GROUP_MEMBER) { continue; }

    else if (this.adjacencyMatrix[i][i] === TO_ADD_GROUP) {
      this.addGroup(i);
    }

    else if (this.adjacencyMatrix[i][i] === TO_UNGROUP) {
      this.ungroup(i);
    }

    else if (this.adjacencyMatrix[i][i] === TO_TOGGLE_GROUP) {
      this.toggleGroup(i);
    }

    else if (this.adjacencyMatrix[i][i] === TO_COLLAPSE_GROUP) {
      this.collapseGroup(i);
    }
  }
  this.reloadNeighbors();
}

// export function matrixToGraph2(event=null) {
//   for (var i = 0; i < this.adjacencyMatrix.length; i++) {
//     let node = this.adjacencyMatrix[i][i]
//     if (node === TO_ADD) {
//       this.addNode(i, event);
//     } else if (node === TO_REMOVE) {
//       this.removeNode(i);
//     } else if (node === TO_HIDE) {
//       this.hideNode(i);
//     }
//     for (var j = 0; j < this.adjacencyMatrix.length; j++) {
//       if (i === j) { continue; }
//       let link = this.adjacencyMatrix[i][j];
//       if (link === TO_ADD) {
//         this.addLink(i, j);
//       } else if (link === TO_REMOVE) {
//         this.removeLink(i, j);
//       } else if (link === TO_HIDE) {
//         this.hideLink(i, j);
//       }
//     }
//   }
// }

export function addNode(i, event=null) {
  this.createNode(ENTITY, event);
  this.adjacencyMatrix[i][i] = DISPLAYED;
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    if (this.adjacencyMatrix[i][j] === TO_ADD) { this.createLink(i, j); }
    if (this.adjacencyMatrix[j][i] === TO_ADD) { this.createLink(j, i); }
  }  
}

export function matrixAddLink(i) {
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    if (this.adjacencyMatrix[i][j] === TO_ADD) { this.createLink(i, j); }
    // if (this.adjacencyMatrix[j][i] === TO_ADD) { this.createLink(j, i); }
  }
  this.adjacencyMatrix[i][i] = DISPLAYED;
}

export function removeNodeFromDOM(i, type) {
  let UPDATED;
  if (type === TO_REMOVE) { UPDATED = REMOVED; } 
  else if (type === TO_HIDE) { UPDATED = HIDDEN; }

  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    if (i === j || !utils.isRemovableNode(this.adjacencyMatrix[j][j])) { continue; } 
    if (this.adjacencyMatrix[i][j] === DISPLAYED) {
      this.links.splice(this.links.indexOf(this.globalLinks[i + '-' + j]), 1);
      this.adjacencyMatrix[i][j] = UPDATED;              
    }
    if (this.adjacencyMatrix[j][i] === DISPLAYED) {
      this.links.splice(this.links.indexOf(this.globalLinks[j + '-' + i]), 1);             
      this.adjacencyMatrix[j][i] = UPDATED;
    }
  }
  this.nodes.splice(this.nodes.indexOf(this.globalNodes[i]), 1);
  this.adjacencyMatrix[i][i] = UPDATED
}

export function unhideNode(i) {
  this.nodes.push(this.globalNodes[i]);
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    if (i === j || !utils.isRemovableNode(this.adjacencyMatrix[j][j])) { continue; }

    if (this.adjacencyMatrix[i][j] === TO_UNHIDE) {
      this.links.push(this.globalLinks[i + '-' + j]);
      this.adjacencyMatrix[i][j] = DISPLAYED;
    }
    if (this.adjacencyMatrix[j][i] === TO_UNHIDE) {
      this.links.push(this.globalLinks[j + '-' + i]);
      this.adjacencyMatrix[j][i] = DISPLAYED;
    }        
  }
  this.adjacencyMatrix[i][i] = DISPLAYED;
}

export function addGroup(i) {
  this.createNode(GROUP);
  
  const group = this.createGroup(i);

  for (var a = 0; a < group.length; a++) {
    // If we have found a particular gorup member, we will transfer over its links to new group node, and add to 'group'
    if (i === group[a]) { continue; } // don't do anything if it's a node
      // i is index of new group id, j is index of group member, k is index of group member's connected link
    this.globalNodes[group[a]].group = this.globalNodes[i].id;
    this.reattachLinks(i, group[a]);
    this.nodes.splice(this.nodes.indexOf(this.globalNodes[group[a]]), 1);
  }
  this.removeInternalLinks(group);
  this.adjacencyMatrix[i][i] = DISPLAYED_GROUP;

}

export function ungroup(i) {
  // this.nodes.splice(this.nodes.indexOf(this.globalNodes[i]), 1);
  const group = this.getGroup(i);
  for (var a = 0; a < group.length; a++) {
    this.adjacencyMatrix[group[a]][group[a]] = TO_UNHIDE;
    this.adjacencyMatrix[group[a]][i] = NONEXISTENT;
    this.globalNodes[group[a]].centroidx = this.globalNodes[i].fixedX = this.globalNodes[i].x;
    this.globalNodes[group[a]].centroidy = this.globalNodes[i].fixedY = this.globalNodes[i].y;

    for (var b = 0; b < this.adjacencyMatrix[i].length; b++) {
      if (a === b) { continue; }
      if (this.adjacencyMatrix[group[a]][b] === DISPLAYED) { this.adjacencyMatrix[group[a]][b] = TO_UNHIDE; }
      if (this.adjacencyMatrix[b][group[a]] === DISPLAYED) { this.adjacencyMatrix[b][group[a]] = TO_UNHIDE; }    
    }
  }
  this.adjacencyMatrix[i][i] = TO_REMOVE
  this.matrixToGraph();
}

// =================
// HELPER METHODS
// =================

export function createNode(type, event=null) {
  let nodeId = this.globalnodeid;
  let newNode;

  if (event) {
    const xPos = (event.x - this.zoomTranslate[0]) / this.zoomScale;
    const yPos = (event.y - this.zoomTranslate[1]) / this.zoomScale;
    newNode = { id: nodeId, name: `Node ${-1 * nodeId}`, type: type, x: xPos, y: yPos, fixed: true};
  } else {
    newNode = { id: nodeId, name: `Node ${-1 * nodeId}`, type: type};
  }

  this.globalnodeid -= 1;
  this.globalNodes.push(newNode);
  this.nodes.push(newNode); 
}

export function createLink(i, j) {
  let link = { id: this.globallinkid, type: "Custom", source: this.globalNodes[i], target: this.globalNodes[j]}
  this.globallinkid -= 1;
  this.globalLinks[i + "-" + j] = link;
  this.links.push(link);
  this.adjacencyMatrix[i][j] = DISPLAYED;
}

export function getGroup(i) {
  var group = [];
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    // If we have found a particular gorup member, we will transfer over its links to new group node, and add to 'group'
    if (i === j) { continue; } // don't do anything if it's a node
    if (this.adjacencyMatrix[i][j] === GROUP_MEMBER) { //in the spot of the links, it's a group member
      // i is index of new group id, j is index of group member, k is index of group member's connected link
      group.push(j);     
    }
  }  
  return group
}

export function createGroup(i) {
  var group = [];
  for (var j = 0; j < this.adjacencyMatrix.length; j++) {
    // If we have found a particular gorup member, we will transfer over its links to new group node, and add to 'group'
    if (i === j) { continue; } // don't do anything if it's a node
    if (this.adjacencyMatrix[i][j] === GROUP_MEMBER) { //in the spot of the links, it's a group member
      // i is index of new group id, j is index of group member, k is index of group member's connected link
      group.push(j);
      this.adjacencyMatrix[j][j] = GROUP_MEMBER;
      this.adjacencyMatrix[j][i] = GROUP_MEMBER;      
    }
  }  
  return group
}

export function reattachLinks(i, j) {
  for (var k = 0; k < this.adjacencyMatrix.length; k++) {
    if (j === k || i === k) { continue; } 
    if (!utils.isVisibleNode(this.adjacencyMatrix[k][k])) {
      if (this.adjacencyMatrix[j][k] === HIDDEN) {
        if (this.adjacencyMatrix[i][k] === NONEXISTENT) {
          this.adjacencyMatrix[i][k] = this.adjacencyMatrix[j][k];
          let link = { id: this.globallinkid, type: "Custom", source: this.globalNodes[i], target: this.globalNodes[k]}
          this.globallinkid -= 1;
          this.globalLinks[i + "-" + k] = link;
        }
      }
      if (this.adjacencyMatrix[k][j] === HIDDEN) {
        this.adjacencyMatrix[k][i] = this.adjacencyMatrix[k][j];
        let link = { id: this.globallinkid, type: "Custom", source: this.globalNodes[k], target: this.globalNodes[i]}
        this.globallinkid -= 1;
        this.globalLinks[k + "-" + i] = link;
      }          
    } else {
      if (this.adjacencyMatrix[j][k] === DISPLAYED) {
        if (this.adjacencyMatrix[i][k] === NONEXISTENT) { this.createLink(i, k); }
        this.links.splice(this.links.indexOf(this.globalLinks[j + '-' + k]), 1);
      }
      if (this.adjacencyMatrix[k][j] === DISPLAYED) {
        if (this.adjacencyMatrix[k][i] === NONEXISTENT) { this.createLink(k, i); }
        this.links.splice(this.links.indexOf(this.globalLinks[k + '-' + j]), 1);
      }
     
    }
  }
}

export function removeInternalLinks(group) {
  for (var a = 0; a < group.length; a++) {
    for (var b = 0; b < group.length; b++) {
      if (a === b) { continue; }
      if (this.adjacencyMatrix[group[a]][group[b]] === DISPLAYED) {
        this.links.splice(this.links.indexOf(this.globalLinks[group[a] + '-' + group[b]]), 1);
      }
    }
  } 
}
