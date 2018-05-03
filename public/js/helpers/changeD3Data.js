import * as utils from './utils.js';

import { 
  NONEXISTENT, 
  TO_REMOVE, 
  REMOVED, 
  TO_ADD,
  TO_ADD_LINK, 
  TO_ADD_GROUP,
  TO_HIDE, 
  TO_UNHIDE,
  HIDDEN, 
  GROUP_MEMBER,
  TO_UNGROUP,
  TO_TOGGLE_GROUP,
  TO_COLLAPSE_GROUP
} from './matrixConstants.js';

import { 
  ENTITY,
  GROUP,
  GROUP_HULL,
  DOCUMENT
} from './typeConstants.js';


// Multi-node manipulation methods
export function deleteSelectedNodes() {
  /* remove selected nodes from DOM
      if the node is a group, delete the group */

  var select = this.svg.selectAll('.node.selected');
  select.each((d) => {
    for (var i = this.adjacencyMatrix.length-1; i >=0; i--) {
      if (this.adjacencyMatrix[i][i].data.id === d.id) { this.deleteNode(i); }
    }
  })

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
}

// Delete selected links
export function deleteSelectedLinks() {
  /* remove selected nodes from DOM
      if the node is a group, delete the group */
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
  this.reloadIdToIndex();
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
  if (this.documentsShown) { //nothing is hidden, hide them
    this.hideDocumentNodes();
  } else {
    this.showHiddenDocuments();
  }
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
  /* turn selected nodes into a new group, then delete the selected nodes and 
    move links that attached to selected nodes to link to the node of the new group instead */
  var select = this.svg.selectAll('.node.selected');
  if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

  const group = [];
  select.each((d) => { group.push(this.idToIndex[d.id]); });

  this.createGroup(group);

  this.hoveredNode = null;
  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

export function ungroupSelectedGroups() {
  /* expand nodes and links in the selected groups, then delete the group from the global groups dict */
  var select = this.svg.selectAll('.node.selected')
    .filter((d) => {
      for (var i = this.adjacencyMatrix.length-1; i >=0; i--) {
        if (this.adjacencyMatrix[i][i].data.id === d.id && utils.isGroup(d)) { this.ungroup(i); }
      }
    });

  this.hoveredNode = null;
  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.node.classed('selected', false);
  this.link.call(this.styleLink, false);
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

export function expandGroups(select, centered = false) {
  /* bring nodes and links from a group back to the DOM, with optional centering around the node of the group's last position */
  var newNodes = [];
  select
    .each((d) => { this.expandGroup(this.idToIndex[d.id]); });
}

export function toggleGroupView(d) {
  /* switch between viewing the group in expanded and collapsed state.
    When expanded, the nodes in the group will have a hull polygon encircling it */
  let index = this.globalNodes.indexOf(d)

  if (!utils.isGroup(d)) { return; }
  if (this.expandedGroups[index]) {
    this.collapseGroup(this.idToIndex[d.id]);
    this.hulls.map((hull, i) => {
      if (hull.groupId === d.id) {
        this.hulls.splice(i, 1); // remove this hull from the global list of hulls
      }
    });
    this.expandedGroups[index] = false;
  } else {
    this.expandGroup(this.idToIndex[d.id]);
    const group = this.getGroupMembers(this.idToIndex[d.id]);
    this.hulls.push(this.createHull(d, group));
    this.expandedGroups[index] = true;
  }
  this.hoveredNode = null;
  this.matrixToGraph();
  this.update();
  this.fillGroupNodes();
}


// export function groupSame() {
//   /* Groups all the nodes that are connected to each other with possibly_same_as */
//   var select = this.svg.selectAll('.node');
//   var grouped = {}; 

//   // update this.sameGroups dict
//   var createdGroup = {};

//   select
//     .each((d) => {
//       if (!grouped[d.id]) { //this node is already in a same-as group
//         grouped[d.id] = true;
//         var groupId = this.globalnodeid;
        
//         createdGroup[d.id] = { links: [], nodes: [d], id: groupId, name: d.name };

//         this.createGroupFromNode(d, createdGroup[d.id], grouped); // Makes a group with d in it

//         if (createdGroup[d.id].nodes.length > 1) {
//           d.group = groupId;
//           this.groups[groupId] = createdGroup[d.id];
//           this.globalnodeid -= 1;
//         }
//         else {
//           delete createdGroup[d.id];
//         }
//       }
//     });

//   for (var key in createdGroup) {
//     // check if the property/key is defined in the object itself, not in parent
//     if (createdGroup.hasOwnProperty(key)) {           
//       const group_same = createdGroup[key];
//       const nodes_same = createdGroup[key]['nodes'];
//       nodes_same.map(node => {
//         this.nodes.splice(this.nodes.indexOf(node), 1);
//         }
//       ); 

//       this.nodes.push({ id: group_same.id, name: group_same.name, type: "same_as_group" }); //add the new node for the group
//       this.moveLinksFromOldNodesToGroup(nodes_same, group_same);

//       this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
//       this.matrixToGraph();
//       this.update();
//       this.fillGroupNodes();
//       this.displayGroupInfo(this.groups);
//     }
//   }
// }

//Hull functions
export function createHull(groupNode, group) {
  var vertices = [];
  var offset = 30; //arbitrary, the size of the node radius

  const nodes = [];
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

  return { groupNode: groupNode, groupId: groupNode.id, path: d3.geom.hull(vertices), type: GROUP_HULL }; //returns a hull object
}

export function calculateAllHulls() {
  /* calculates paths of all hulls in the global hulls list */
  this.hulls.map((hull, i) => {
    const group = this.getGroupMembers(this.idToIndex[hull.groupId]);

    this.hulls[i] = this.createHull(hull.groupNode, group);
  });
}

export function drawHull(d) {
  return this.curve(d.path);
}
