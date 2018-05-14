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
        // const parent = this.getParent(i);
        // if (parent) {
        //   if (this.getGroupMembers(i).length <= 2) { debugger; this.ungroup(parent); }
        // }
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
  this.force.stop();
  var select = this.svg.selectAll('.node');
  var grouped = {}; 

  var createdGroup = {};
  select
    .each((d) => {
      if (!grouped[d.id]) { //this node is already in a same-as group
        grouped[d.id] = true;
        
        createdGroup[d.id] = { group: [this.idToIndex[d.id]] };
        this.createGroupFromNode(d, createdGroup[d.id].group, grouped); // Makes a group with d in it

        if (createdGroup[d.id].group.length <= 1) { delete createdGroup[d.id]; }
        if (d === this.hoveredNode) { this.deletingHoveredNode = true; }
      }
    });

  for (var key in createdGroup) {
    // check if the property/key is defined in the object itself, not in parent
    if (createdGroup.hasOwnProperty(key)) {  
      const group = createdGroup[key]['group'];
      this.createGroup(group)
    }
  }

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}


export function createGroupFromNode(node, group, grouped) { 
  /* Creates a group connected by possibly_same_as around node, adding it to group,
  and marking it as true in grouped so it isn't revisited later */
  this.links.map((link) => {
    this.checkLinkAddGroup(link, group, grouped);
  });
}

export function checkLinkAddGroup(link, group, grouped) {
  /* takes in a list of nodes and the link to be removed
      if the one of the nodes in the link target or source is attached to the link AND link is of type 'possibly_same_as',
      remove the link and add whatever is connected to this link to the group if it isn't already */
  const target = this.idToIndex[link.target.id];
  const source = this.idToIndex[link.source.id];
  //only remove a link if it's attached to a removed node
  if (link.type === 'possibly_same_as' && (group.indexOf(source) > -1 || group.indexOf(target) > -1)) { //remove all links connected to a node in group and with correct type
    // Make sure both sides of this link are in the group, and recursively add theirs to group as well
    if (group.indexOf(source) <= -1) {
      group.push(source);
      this.createGroupFromNode(link.source, group, grouped);
    }

    else if (group.indexOf(target) <= -1) {
      group.push(target);
      this.createGroupFromNode(link.target, group, grouped);
    }

    // So that these nodes aren't checked again later to try and create a possibly same as
    grouped[link.source.id] = true;
    grouped[link.target.id] = true;
  }
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
