import * as utils from './utils.js';

// Multi-node manipulation methods
export function deleteSelectedNodes() {
  /* remove selected nodes from DOM
      if the node is a group, delete the group */

  var groupIds = Object.keys(this.groups);
  var select = this.svg.selectAll('.node.selected');
  let group;

  var removedNodes = this.removeNodesFromDOM(select);
  var removedLinks = this.removeNodeLinksFromDOM(removedNodes);

  removedLinks.map((link) => { //remove links from their corresponding group
    if (link.target.group) {
      group = this.groups[link.target.group];
      group.links.splice(group.links.indexOf(link), 1);
    } if (link.source.group) {
      group = this.groups[link.source.group];
      group.links.splice(group.links.indexOf(link), 1);
    }
  });

  removedNodes.map((node) => {// remove nodes from their corresponding group & if the node is a group delete the group
    if (utils.isInArray(node.id, groupIds)) {
      delete this.groups[node.id];
    }
    if (node.group) {
      group = this.groups[node.group];
      group.nodes.splice(group.nodes.indexOf(node), 1);
    }
  });

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
}

// Delete selected links
export function deleteSelectedLinks() {
  /* remove selected nodes from DOM
      if the node is a group, delete the group */
  var groupIds = Object.keys(this.groups);
  var select = this.svg.selectAll('.node.selected');
  let group;

  var removedLinks = this.removeNodeLinksSelectiveFromDOM(select);

  removedLinks.map((link) => { //remove links from their corresponding group
    if (link.target.group) {
      group = this.groups[link.target.group];
      group.links.splice(group.links.indexOf(link), 1);
    } if (link.source.group) {
      group = this.groups[link.source.group];
      group.links.splice(group.links.indexOf(link), 1);
    }
  });

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.node.classed("selected", false)
  this.update();
}

export function addNodeToSelected(selection, event=null) {
  /* create a new node using the globalnodeid counter
    for each node selected, create a link attaching the new node to the selected node
    remove highlighting of all nodes and links */
  const nodeId = this.globalnodeid;
  let newNode;
  if (event) {
    const xPos = (event.x - this.zoomTranslate[0]) / this.zoomScale;
    const yPos = (event.y - this.zoomTranslate[1]) / this.zoomScale;
    newNode = { id: nodeId, name: `Node ${-1 * nodeId}`, type: "Custom", x: xPos, y: yPos, fixed: true};
  } else {
    newNode = { id: nodeId, name: `Node ${-1 * nodeId}`, type: "Custom"};
  }

  this.globalnodeid -= 1;
  this.nodes.push(newNode);

  selection
    .each((d) => {
      this.links.push({ id: this.globallinkid, source: this.nodes.length - 1, target: this.nodes.indexOf(d), type: "Custom" });
      this.globallinkid -= 1;
    })

  this.node.classed("selected", false);
  this.link.classed("selected", false);
  this.nodeSelection = {};
  this.update();
  this.fillGroupNodes();
}

export function toggleDocumentView() {
  if (this.hidden.links.length === 0 && this.hidden.nodes.length === 0) { //nothing is hidden, hide them
    this.hideDocumentNodes();
  } else {
    this.showHiddenNodes();
  }

  this.update();
}

export function hideDocumentNodes() {
  var select = this.svg.selectAll('.node')
    .filter((d) => {
      if (d.type === "Document") { return d; }
    })

  this.hideNodes(select);
}

export function hideNodes(select) {
  /* remove nodes
      remove links attached to the nodes
      push all the removed nodes & links to the global list of hidden nodes and links */

  const removedNodes = this.removeNodesFromDOM(select);
  const removedLinks = this.removeNodeLinksFromDOM(removedNodes);
  removedNodes.map((node) => {
    this.hidden.nodes.push(node)
  });
  removedLinks.map((link) => {
    this.hidden.links.push(link)
  });
}

export function showHiddenNodes() {
  /* add all hidden nodes and links back to the DOM display */

  this.hidden.nodes.slice().map((node) => { this.nodes.push(node); });
  this.hidden.links.slice().map((link) => { this.links.push(link); });

  this.hidden.links = [];
  this.hidden.nodes = [];
}

export function groupSame() {
  /* Groups all the nodes that are connected to each other with possibly_same_as */
  var select = this.svg.selectAll('.node');
  var grouped = {}; 

  // update this.sameGroups dict
  var createdGroup = {};

  select
    .each((d) => {
      if (!grouped[d.id]) { //this node is already in a same-as group
        grouped[d.id] = true;
        var groupId = this.globalnodeid;
        
        createdGroup[d.id] = { links: [], nodes: [d], id: groupId, name: d.name };

        this.createGroupFromNode(d, createdGroup[d.id], grouped); // Makes a group with d in it

        if (createdGroup[d.id].nodes.length > 1) {
          d.group = groupId;
          this.groups[groupId] = createdGroup[d.id];
          this.globalnodeid -= 1;
        }
        else {
          delete createdGroup[d.id];
        }
      }
    });

  for (var key in createdGroup) {
    // check if the property/key is defined in the object itself, not in parent
    if (createdGroup.hasOwnProperty(key)) {           
      const group_same = createdGroup[key];
      const nodes_same = createdGroup[key]['nodes'];
      nodes_same.map(node => {
        this.nodes.splice(this.nodes.indexOf(node), 1);
        }
      ); 

      this.nodes.push({ id: group_same.id, name: group_same.name, type: "same_as_group" }); //add the new node for the group
      this.moveLinksFromOldNodesToGroup(nodes_same, group_same);

      this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
      this.update();
      this.fillGroupNodes();
      this.displayGroupInfo(this.groups);
    }
  }
}

export function groupSelectedNodes() {
  /* turn selected nodes into a new group, then delete the selected nodes and 
    move links that attached to selected nodes to link to the node of the new group instead */
  var select = this.svg.selectAll('.node.selected');

  if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

  const group = this.createGroupFromSelect(select);
  const removedNodes = this.removeNodesFromDOM(select);
  this.nodes.push({ id: group.id, name: `Group ${-1 * group.id}`, type: "group" }); //add the new node for the group
  this.moveLinksFromOldNodesToGroup(removedNodes, group);

  select.each((d) => { delete this.groups[d.id]; });
  // delete any groups that were selected AFTER all nodes & links are deleted
  // and properly inserted into the global variable entry for the new group

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.update();
  this.fillGroupNodes();
  this.displayGroupInfo(this.groups);
}

export function ungroupSelectedGroups() {
  /* expand nodes and links in the selected groups, then delete the group from the global groups dict */
  var select = this.svg.selectAll('.node.selected')
    .filter((d) => {
      if (this.groups[d.id]) { return d; }
    });

  const newNodes = this.expandGroups(select, false);
  newNodes.map((node) => { node.group = null }); //these nodes no longer have a group
  select.each((d) => { delete this.groups[d.id]; }); //delete this group from the global groups 

  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  this.node.classed("selected", false)
  this.link.classed("selected", false)
  this.update();
  this.displayGroupInfo(this.groups);
}

export function expandGroup(groupId) {
  /* expand the group of the groupId passed in*/
  var select = this.svg.selectAll('.node')
    .filter((d) => {
      if (d.id === groupId && this.groups[d.id]) { return d; }
    });

  this.expandGroups(select, true);
}

export function expandGroups(select, centered = false) {
  /* bring nodes and links from a group back to the DOM, with optional centering around the node of the group's last position */
  var newNodes = [];
  select
    .each((d) => {
      const group = this.groups[d.id];
      if (group) {
        group.nodes.map((node) => {
          if (centered) {
            node.centroidx = group.fixedX = d.x; //store the coordinates of the group node
            node.centroidy = group.fixedY = d.y;
          }
          newNodes.push(node);
          this.nodes.push(node); //add all nodes in the group to global nodes
        });
        group.links.map((link) => {
          this.links.push(link); //add all links in the group to global links
        });
      }
    });

  const removedNodes = this.removeNodesFromDOM(select);
  this.removeNodeLinksFromDOM(removedNodes);
  this.hoveredNode = null;
  return newNodes;
}

export function collapseGroupNodes(groupId) {
  /* collapse nodes in a group into a single node representing the group */
  const group = this.groups[groupId];
  const groupNodeIds = group.nodes.map((node) => { return node.id; });

  var select = this.svg.selectAll('.node')
    .filter((d) => {
      if (utils.isInArray(d.id, groupNodeIds)) { return d; }
    });

  const removedNodes = this.removeNodesFromDOM(select);
  this.nodes.push({ id: group.id, name: `Group ${-1 * group.id}`, type: 'group' }); //add the new node for the group
  this.moveLinksFromOldNodesToGroup(removedNodes, group);
}

export function toggleGroupView(groupId) {
  /* switch between viewing the group in expanded and collapsed state.
    When expanded, the nodes in the group will have a hull polygon encircling it */
  const group = this.groups[groupId];

  if (!group) {
    console.error("Group doesn't exist even when it should: ", groupId);
  }

  if (this.expandedGroups[groupId]) {
    this.collapseGroupNodes(groupId);
    this.hulls.map((hull, i) => {
      if (hull.groupId === groupId) {
        this.hulls.splice(i, 1); // remove this hull from the global list of hulls
      }
    })
    this.expandedGroups[groupId] = false;
  } else {
    this.expandGroup(groupId);
    this.hulls.push(this.createHull(group));
    this.expandedGroups[groupId] = true;
  }

  this.update();
  this.fillGroupNodes();
}

//Hull functions
export function createHull(group) {
  var vertices = [];
  var offset = 30; //arbitrary, the size of the node radius

  const nodeids = this.nodes.map((node) => { return node.id }); // create array of all ids in nodes
  group.nodes.map((d) => {
    if (utils.isInArray(d.id, nodeids)) {
      // draw a hull around a node only if it's shown on the DOM
      vertices.push(
        [d.x + offset, d.y + offset], // creates a buffer around the nodes so the hull is larger
        [d.x - offset, d.y + offset],
        [d.x - offset, d.y - offset],
        [d.x + offset, d.y - offset]
      );
    }
  });

  return { groupId: group.id, path: d3.geom.hull(vertices) }; //returns a hull object
}

export function calculateAllHulls() {
  /* calculates paths of all hulls in the global hulls list */
  this.hulls.map((hull, i) => {
    this.hulls[i] = this.createHull(this.groups[hull.groupId]);
  });
}

export function drawHull(d) {
  return this.curve(d.path);
}

//
// Helpers for manipulating data
//
//


export function removeLink(removedNodes, link) {
  /* takes in a list of removed nodes and the link to be removed
      if the one of the nodes in the link target or source has actually been removed, remove the link and return it
      if not, then don't remove */
  let removedLink;
  //only remove a link if it's attached to a removed node
  if (removedNodes[link.source.id] === true || removedNodes[link.target.id] === true) { //remove all links connected to a node to remove
    const index = this.links.indexOf(link);
    removedLink = this.links.splice(index, 1)[0];
  }

  return removedLink;
}

export function createGroupFromNode(node, group, grouped) { 
  /* Creates a group connected by possibly_same_as around node, adding it to group,
  and marking it as true in grouped so it isn't revisited later */
  this.links.slice().map((link) => {
    const removedLink = this.checkLinkAddGroup(link, group, grouped);
  });
}

export function checkLinkAddGroup(link, group, grouped) {
  /* takes in a list of nodes and the link to be removed
      if the one of the nodes in the link target or source is attached to the link AND link is of type 'possibly_same_as',
      remove the link and add whatever is connected to this link to the group if it isn't already */
  let checkedLink;
  //only remove a link if it's attached to a removed node
  if (link.type === 'possibly_same_as' && (group.nodes.indexOf(link.source) > -1 || group.nodes.indexOf(link.target) > -1)) { //remove all links connected to a node in group and with correct type
    // Make sure both sides of this link are in the group, and recursively add theirs to group as well
    if (group.nodes.indexOf(link.source) <= -1) {
      //group[link.source.id] = true;
      group.nodes.push(link.source);
      this.createGroupFromNode(link.source, group, grouped);
    }
    else if (group.nodes.indexOf(link.target) <= -1) {
      group.nodes.push(link.target);
      //group[link.target.id] = true;
      this.createGroupFromNode(link.target, group, grouped);
    }
    // So that these nodes aren't checked again later to try and create a possibly same as
    grouped[link.source.id] = true;
    grouped[link.target.id] = true;
  }
  else if (group.nodes.indexOf(link.source) > -1 || group.nodes.indexOf(link.target) > -1) {
    group.links.push(link);
  }

  return checkedLink;
}

export function removeSelectiveLink(nodesSelected, link) {
  /* takes in a list of removed nodes and the link to be removed
      if both of the nodes in the link target or source are in the list, remove the link and return it
      if not, then don't remove */
  let removedLink;
  if (nodesSelected[link.source.id] === true && nodesSelected[link.target.id] === true) { //remove all links connected to both nodes to remove
    const index = this.links.indexOf(link);
    removedLink = this.links.splice(index, 1)[0];
  }

  return removedLink;
}

export function reattachLink(link, newNodeId, removedNodes, nodeIdsToIndex) {
  /* takes in a link, id of the new nodes, and a dict mapping ids of removed nodes to state
      depending on whether the link source or target will be newNodeId,
      create a new link with appropriate source/target mapping to index of the node
      if neither the source nor target were in removedNodes, do nothing */
  let linkid = this.globallinkid;
  if (removedNodes[link.source.id] === true && removedNodes[link.target.id] !== true) {
    //add new links with appropriate connection to the new group node
    //source and target refer to the index of the node
    this.links.push({ id: linkid, source: nodeIdsToIndex[newNodeId], target: nodeIdsToIndex[link.target.id], type: 'multiple' });
    this.globallinkid -= 1;
  } else if (removedNodes[link.source.id] !== true && removedNodes[link.target.id] === true) {
    this.links.push({ id: linkid, source: nodeIdsToIndex[link.source.id], target: nodeIdsToIndex[newNodeId], type: 'multiple' });
    this.globallinkid -= 1;
  }
}

export function moveLinksFromOldNodesToGroup(removedNodes, group) {
  /* takes in an array of removedNodes and a group
    removes links attached to these nodes
    if the removed link was already attached to a group, don't add that link to the group's list of links 
    (because we're not adding that node to the group's list of nodes)
    if else, add that link to the group's list of links
    then reattach the link */

  var self = this;
  const removedNodesDict = {};
  const nodeIdsToIndex = {};
  const existingLinks = {};

  removedNodes.map((node) => {
    removedNodesDict[node.id] = true;
  });

  this.nodes.map((node, i) => {
    nodeIdsToIndex[node.id] = i; //map all nodeIds to their new index
  });
  group.links.map((link) => {
    existingLinks[link.target.id + ',' + link.source.id] = true;
  })

  this.links.slice().map((link) => {
    const removedLink = self.removeLink(removedNodesDict, link);
    if (removedLink) {
      const groupids = Object.keys(this.groups).map((key) => { return parseInt(key); });
      if (utils.isInArray(link.target.id, groupids) || utils.isInArray(link.source.id, groupids)) {
        // do nothing if the removed link was attached to a group
      } else if (existingLinks[link.target.id + ',' + link.source.id]) {
        //do nothing if the link already exists in the group, i.e. if you're expanding
      } else {
        group.links.push(removedLink);
      }
      this.reattachLink(link, group.id, removedNodesDict, nodeIdsToIndex);
    }
  });
}

export function removeNodesFromDOM(select) {
  /* iterates through a select to remove each node, and returns an array of removed nodes */

  const removedNodes = [];
  select
    .each((d) => {
      if (this.nodes.indexOf(d) === -1) {
        console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", this.nodes);
      } else {
        removedNodes.push(d);
        this.nodes.splice(this.nodes.indexOf(d), 1);
      }
    });

  return removedNodes;
}

export function removeNodeLinksFromDOM(removedNodes) {
  /* takes in an array of nodes and removes links associated with any of them
      returns an arry of removed links */
  const removedLinks = [];
  let removedLink;
  const removedNodesDict = {};

  removedNodes.map((node) => {
    removedNodesDict[node.id] = true;
  });

  this.links.slice().map((link) => {
    removedLink = this.removeLink(removedNodesDict, link);
    if (removedLink) {
      removedLinks.push(removedLink);
    }
  });

  return removedLinks;
}

export function removeNodeLinksSelectiveFromDOM(select) {
  /* iterates through select to gather list of nodes selected, and removes
      link if both of its endpoint nodes are selected */

  const nodesSelected = []
  select
    .each((d) => {
      if (this.nodes.indexOf(d) === -1) {
        console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", this.nodes);
      } else {
        nodesSelected.push(d);
      }
    });

  const removedLinks = [];
  let removedLink;
  const nodesDict = {};

  nodesSelected.map((node) => {
    nodesDict[node.id] = true;
  })

  this.links.slice().map((link) => {
    removedLink = this.removeSelectiveLink(nodesDict, link);
    if (removedLink) {
      removedLinks.push(removedLink);
    }
  });

  return removedLinks;
}

export function createGroupFromSelect(select) {
  /* iterates through the items in select to create a new group with proper links and nodes stored.
      if a node in the select is already a group, takes the nodes and links from that group and puts it in
      the new group */

  const groupId = this.globalnodeid;
  const group = this.groups[groupId] = { links: [], nodes: [], id: groupId }; //initialize empty array to hold the nodes

  select
    .each((d) => {
      if (this.groups[d.id]) { //this node is already a group
        var newNodes = this.groups[d.id].nodes;
        var newLinks = this.groups[d.id].links;
        newNodes.map((node) => {
          group.nodes.push(node); //add each of the nodes in the old group to the list of nodes in the new group        
        });
        newLinks.map((link) => {
          group.links.push(link); //add all the links inside the old group to the new group
        });
      } else {
        d.group = groupId;
        group.nodes.push(d); //add this node to the list of nodes in the group
      }
    });

  this.globalnodeid -= 1;
  return group;
}
