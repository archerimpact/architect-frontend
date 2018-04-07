// // Occurs each tick of simulation
// export function ticked(e) {
//   force.resume();
//   if (!hull.empty()) {
//     calculateAllHulls()
//     hull.data(hulls)
//       .attr('d', drawHull)  
//   }
//   node
//     .each(groupNodesForce(.3))
//     .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

//   link.attr('x1', function(d) { return d.source.x; })
//       .attr('y1', function(d) { return d.source.y; })
//       .attr('x2', function(d) { return d.target.x; })
//       .attr('y2', function(d) { return d.target.y; });
// }

// export function groupNodesForce(alpha){
//   /* custom force that takes the parent group position as the centroid and moves all the nodes near */
//   return function(d){
//     if (d.group) {
//       d.y += (d.cy - d.y) * alpha;
//       d.x += (d.cx - d.x) * alpha;
//     }
//   }
// }

// // Click-drag node selection
// export function brushstart() {
//   isBrushing = true;
// }

// export function brushing() {
//   if (isRightClick()) {
//     const extent = brush.extent();
//     svg.selectAll('.node')
//       .classed('selected', function (d) {
//         const xPos = brushX.invert(d.x * zoomScale + zoomTranslate[0]);
//         const yPos = brushY.invert(d.y * zoomScale + zoomTranslate[1]);
//         const selected = (extent[0][0] <= xPos && xPos <= extent[1][0]
//                   && extent[0][1] <= yPos && yPos <= extent[1][1])
//                   || (this.classList.contains('selected') && d3.event.sourceEvent.ctrlKey);
//         nodeSelection[d.index] = selected;
//         return selected;
//       });

//     highlightLinksFromAllNodes();
//   }
// }

// export function brushend() {
//   brush.clear();
//   svg.selectAll('.brush').call(brush);
//   isBrushing = false;
// }

// // Single-node interactions
// export function clicked(d, i) {
//   if (d3.event.defaultPrevented) return;
//   const node = d3.select(this);
//   const fixed = !(node.attr('dragfix') == 'true');
//   node.classed('fixed', d.fixed = fixed);
//   force.resume();
//   d3.event.stopPropagation();
// }

// export function rightclicked(node, d) {
//   const fixed = node.attr('dragfix') == 'true';
//   const selected = !(node.attr('dragselect') == 'true');
//   node.classed('fixed', d.fixed = fixed)
//       .classed('selected', nodeSelection[d.index] = selected);
//   highlightLinksFromNode(node[0]);
//   force.resume();
// }

// export function dblclicked(d) {
//   if (groups[d.id]) {
//     toggleGroupView(d.id);
//   }

//   d3.event.stopPropagation();
// }

// // Click helper
// export function isRightClick() {
//   return (d3.event && (d3.event.which == 3 || d3.event.button == 2))
//       || (d3.event.sourceEvent && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2));
// }

// // Click-drag node interactions
// export function dragstart(d) {
//   d3.event.sourceEvent.preventDefault();
//   d3.event.sourceEvent.stopPropagation();
//   if (isEmphasized) resetGraphOpacity();

//   isDragging = true;
//   displayNodeInfo(d);
//   const node = d3.select(this);
//   node
//     .attr('dragfix', node.classed('fixed'))
//     .attr('dragselect', node.classed('selected'))
//     .attr('dragdistance', 0);

//   node.classed('fixed', d.fixed = true); 
//   if (isRightClick()) {
//     node.classed('selected', nodeSelection[d.index] = true);
//     highlightLinksFromNode(node[0]);
//   }
// } 

// export function dragging(d) {
//   const node = d3.select(this);
//   node
//     .attr('cx', d.x = d3.event.x)
//     .attr('cy', d.y = d3.event.y)
//     .attr('dragdistance', parseInt(node.attr('dragdistance')) + 1);
//   }

// export function dragend(d) {
//   const node = d3.select(this);
//   if (!parseInt(node.attr('dragdistance')) && isRightClick()) {
//     rightclicked(node, d);
//   }

//   isDragging = false;
//   force.resume();
// }

// // Node emphasis
// export function mouseover(d) {
//   if (!isDragging && !isBrushing) {
//     isEmphasized = true;
//     node
//       .filter(function(o) {
//         return !neighbors(d, o);
//       })
//       .style('stroke-opacity', .15)
//       .style('fill-opacity', .15);
//     // .select('.node-name')
//     //   .text(function(d) { return processNodeName(d.name, 1); });

//     link.style('stroke-opacity', function(o) {
//       return (o.source == d || o.target == d) ? 1 : .05;
//     });

//     if (printFull == 0) d3.select(this).select('.node-name').text(processNodeName(d.name, 2));
//   }
// }

// export function mouseout(d) {
//   resetGraphOpacity();
//   if (printFull != 1) d3.select(this).select('.node-name').text(function(d) { return processNodeName(d.name, printFull); });
// }

// // Zoom & pan
// export function zoomstart() {
//   const e = d3.event;
//   if (isRightClick()) {
//     zoomTranslate = zoom.translate();
//     zoomScale = zoom.scale();
//   }
// }

// export function zooming() {
//   if (!isRightClick()) {
//     const e = d3.event;
//     const transform = 'translate(' + (((e.translate[0]/e.scale) % gridLength) - e.translate[0]/e.scale)
//       + ',' + (((e.translate[1]/e.scale) % gridLength) - e.translate[1]/e.scale) + ')scale(' + 1 + ')';
//     svgGrid.attr('transform', transform);
//     container.attr('transform', 'translate(' + e.translate + ')scale(' + e.scale + ')');
//   }
// }

// export function zoomend() {
//   svg.attr('cursor', 'move');
//   if (isRightClick()) {
//     zoom.translate(zoomTranslate);
//     zoom.scale(zoomScale);
//   }

//   zoomTranslate = zoom.translate();
//   zoomScale = zoom.scale();
// } 

// // Link mouse handlers
// export function mouseoverLink(d) {
//   displayLinkInfo(d);
// }

// // Node text mouse handlers
// export function clickedText(d, i) {
//   d3.event.stopPropagation();
// }

// export function dragstartText(d) {
//   d3.event.sourceEvent.stopPropagation();
// }

// export function draggingText(d) {
//   d3.event.sourceEvent.stopPropagation();
// }

// export function dragendText(d) {
//   d3.event.sourceEvent.stopPropagation();
// }

// export function mouseoverText(d) {
//   if (printFull == 0 && !isBrushing && !isDragging) {
//     d3.select(this).text(processNodeName(d.name, 2));
//   }

//   d3.event.stopPropagation();
// }

// export function mouseoutText(d) {
//   if (printFull == 0 && !isBrushing && !isDragging) {
//     d3.select(this).text(processNodeName(d.name, 0));
//   }

//   d3.event.stopPropagation();
// }

// // Graph manipulation keycodes
// d3.select('body')
//   .on('keydown', function() {
//     // u: Unpin selected nodes
//     if (d3.event.keyCode == 85) {
//       svg.selectAll('.node.selected')
//         .each(function(d) { d.fixed = false; })
//         .classed('fixed', false);
//     }

//     // g: Group selected nodes
//     else if (d3.event.keyCode == 71) {
//       groupSelectedNodes();
//     }

//     // h: Ungroup selected nodes
//     else if (d3.event.keyCode == 72) {
//       ungroupSelectedGroups();
//     }

//     // r: Remove selected nodes
//     else if (d3.event.keyCode == 82 || d3.event.keyCode == 46) {
//       deleteSelectedNodes();
//     }

//     // a: Add node linked to selected
//     else if (d3.event.keyCode == 65) {
//       addNodeToSelected();
//     }

//     // d: Hide document nodes
//     else if (d3.event.keyCode == 68) {
//       toggleDocumentView();
//     }

//     // p: Toggle btwn full/abbrev text
//     else if (d3.event.keyCode == 80) {
//       printFull = (printFull + 1) % 3;
//       selectAllNodeNames().text(function(d) { return processNodeName(d.name, printFull); });
//     }

//     force.resume()
//   });

// // Link highlighting
// export function highlightLinksFromAllNodes() {
//   svg.selectAll('.link')
//     .classed('selected', function(d, i) {
//       return nodeSelection[d.source.index] && nodeSelection[d.target.index];
//     });
// }

// export function highlightLinksFromNode(node) {
//   node = node[0].__data__.index;
//   svg.selectAll('.link')
//     .filter(function(d, i) {
//       return d.source.index == node || d.target.index == node;
//     })
//     .classed('selected', function(d, i) {
//       return nodeSelection[d.source.index] && nodeSelection[d.target.index];
//     });
// }

// // Multi-node manipulation methods
// export function deleteSelectedNodes() {
//   /* remove selected nodes from DOM
//       if the node is a group, delete the group */
//   var groupIds = Object.keys(groups);
//   var select = svg.selectAll('.node.selected');
//   let group;

//   var removedNodes = removeNodesFromDOM(select);
//   var removedLinks = removeNodeLinksFromDOM(removedNodes);

//   removedLinks.map((link)=> { //remove links from their corresponding group
//     if (link.target.group) {
//       group = groups[link.target.group];
//       group.links.splice(group.links.indexOf(link), 1);
//     } if (link.source.group) {
//       group = groups[link.source.group];
//       group.links.splice(group.links.indexOf(link), 1);
//     }
//   });

//   removedNodes.map((node) => {// remove nodes from their corresponding group & if the node is a group delete the group
//     if (isInArray(node.id, groupIds)) {
//       delete groups[node.id];
//     }
//     if (node.group) {
//       group = groups[node.group];
//       group.nodes.splice(group.nodes.indexOf(node), 1);
//     }
//   });

//   nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
//   this.update();
// }

// export function addNodeToSelected(){
//   /* create a new node using the globalnodeid counter
//     for each node selected, create a link attaching the new node to the selected node
//     remove highlighting of all nodes and links */
//   const nodeid = globalnodeid;
//   const newnode = {id: nodeid, name: `Node ${-1*nodeid}`, type: "Custom"};
//   var select = svg.selectAll('.node.selected');
//   if (select[0].length === 0) { return; } //if nothing is selected, don't add a node for now because it flies away

//   globalnodeid -= 1;
//   nodes.push(newnode);

//   select
//     .each((d) => {
//       links.push({id: globallinkid, source: nodes.length-1, target: nodes.indexOf(d), type: "Custom"});
//       globallinkid -= 1;
//     })

//   node.classed("selected", false);
//   link.classed("selected", false);
//   nodeSelection = {};
//   this.update();
// }

// export function toggleDocumentView() {
//   if (hidden.links.length === 0 && hidden.nodes.length ===0) { //nothing is hidden, hide them
//     hideDocumentNodes();
//   } else {
//     showHiddenNodes();
//   }
//   this.update();
// }

// export function hideDocumentNodes() {
//   var select = svg.selectAll('.node')
//     .filter((d) => {
//       if (d.type === "Document") { return d; }
//     })

//   hideNodes(select);
// }

// export function hideNodes(select) {
//   /* remove nodes
//       remove links attached to the nodes
//       push all the removed nodes & links to the global list of hidden nodes and links */

//   const removedNodes = removeNodesFromDOM(select);
//   const removedLinks = removeNodeLinksFromDOM(removedNodes);
//   removedNodes.map((node)=> {
//     hidden.nodes.push(node)
//   });
//   removedLinks.map((link)=>{
//     hidden.links.push(link)
//   });
// }

// export function showHiddenNodes() {
//   /* add all hidden nodes and links back to the DOM display */

//   hidden.nodes.slice().map((node) => { nodes.push(node); });
//   hidden.links.slice().map((link)=> { links.push(link); });

//   hidden.links =[];
//   hidden.nodes = [];
// }

// export function groupSelectedNodes() {
//   /* turn selected nodes into a new group, then delete the selected nodes and 
//   move links that attached to selected nodes to link to the node of the new group instead */
//   var select = svg.selectAll('.node.selected');

//   if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

//   const group = createGroupFromSelect(select);
//   const removedNodes = removeNodesFromDOM(select);
//   nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: "group"}); //add the new node for the group
//   moveLinksFromOldNodesToGroup(removedNodes, group);

//   select.each((d)=> { delete groups[d.id]; });
//     // delete any groups that were selected AFTER all nodes & links are deleted
//     // and properly inserted into the global variable entry for the new group

//   nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
//   this.update();
//   fillGroupNodes();
//   displayGroupInfo(groups);
// }

// export function ungroupSelectedGroups() {
//   /* expand nodes and links in the selected groups, then delete the group from the global groups dict */
//   var select = svg.selectAll('.node.selected')
//     .filter((d)=>{
//       if (groups[d.id]){ return d; }
//     });

//   const newNodes = expandGroups(select, centered=false);
//   newNodes.map((node) => { node.group=null }); //these nodes no longer have a group
//   select.each((d) => { delete groups[d.id]; }); //delete this group from the global groups 

//   nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
//   node.classed("selected", false)
//   this.update();
//   displayGroupInfo(groups);
// }

// export function expandGroup(groupId) {
//   /* expand the group of the groupId passed in*/
//   var select = svg.selectAll('.node')
//     .filter((d) => {
//       if (d.id === groupId && groups[d.id]) { return d; }
//     });

//   expandGroups(select, centered=true);
// }

// export function expandGroups(select, centered=false) {
//   /* bring nodes and links from a group back to the DOM, with optional centering around the node of the group's last position */
//   var newNodes = [];
//   select
//     .each((d) => {
//       const group = groups[d.id];
//       if (group) {
//         group.nodes.map((node) => {
//           if (centered) {
//             group.fixedX = d.x; //store the coordinates of the group node
//             group.fixedY = d.y;
//             const offset = .5*45* Math.sqrt(group.nodes.length); // math to make the total area of the hull equal to 15*15 per node
//             const xboundlower = group.fixedX - offset;
//             const yboundlower = group.fixedY - offset;

//             node.x = node.px = Math.floor(Math.random() * offset * 2) + xboundlower;
//             node.y = node.py = Math.floor(Math.random() * offset * 2) + yboundlower; 
//             node.cx = group.fixedX;
//             node.cy = group.fixedY;
//             //node.fixed = true;  
//           }
//           newNodes.push(node);
//           nodes.push(node); //add all nodes in the group to global nodes
//         });
//         group.links.map((link) => {
//           links.push(link); //add all links in the group to global links
//         });
//       }
//     });

//   const removedNodes = removeNodesFromDOM(select);
//   removeNodeLinksFromDOM(removedNodes);
//   return newNodes;
// }

// export function collapseGroupNodes(groupId) {
//   /* collapse nodes in a group into a single node representing the group */
//   const group = groups[groupId];
//   const groupNodeIds = group.nodes.map((node) => { return node.id; });

//   var select = svg.selectAll('.node')
//     .filter((d) => {
//       if (isInArray(d.id, groupNodeIds)) { return d; }
//     });

//   const removedNodes = removeNodesFromDOM(select);
//   nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: 'group'}); //add the new node for the group
//   moveLinksFromOldNodesToGroup(removedNodes, group);
// }

// export function toggleGroupView(groupId) {
//   /* switch between viewing the group in expanded and collapsed state.
//     When expanded, the nodes in the group will have a hull polygon encircling it */
//   const group = groups[groupId];

//   if (!group) {
//     console.log("error, the group doesn't exist even when it should: ", groupId);
//   }

//   if (expandedGroups[groupId]) {
//     collapseGroupNodes(groupId);
//     hulls.map((hull, i) => {
//       if (hull.groupId === groupId) {
//         hulls.splice(i, 1); // remove this hull from the global list of hulls
//       }
//     })
//     expandedGroups[groupId] = false;
//   } else {
//     expandGroup(groupId);
//     hulls.push(createHull(group));
//     expandedGroups[groupId] = true;
//   }

//   this.update();
//   fillGroupNodes();
// }

// //Hull functions
// export function createHull(group) {
//   var vertices = [];
//   var offset = 20; //arbitrary, the size of the node radius
//   group.nodes.map(function(d) {
//     vertices.push(
//       [d.x + offset, d.y + offset], // creates a buffer around the nodes so the hull is larger
//       [d.x - offset, d.y + offset], 
//       [d.x - offset, d.y - offset], 
//       [d.x + offset, d.y - offset]
//     );
//   });

//   return {groupId: group.id, path: d3.geom.hull(vertices)}; //returns a hull object
// }

// export function calculateAllHulls() {
//   /* calculates paths of all hulls in the global hulls list */
//   hulls.map((hull, i) => {
//     hulls[i] = createHull(groups[hull.groupId]);
//   });
// }

// export function drawHull(d) {
//   return curve(d.path);
// }

// // =================
// // SELECTION METHODS
// // =================

// // Get all node text elements
// export function selectAllNodeNames() {
//   return d3.selectAll('text')
//       .filter(function(d) { return d3.select(this).classed('node-name'); });
// }

// // ==============
// // HELPER METHODS
// // ==============

// // Normalize node text to same casing conventions and length
// // printFull states - 0: abbrev, 1: none, 2: full
// export function processNodeName(str, printFull) {
//   if (!str || printFull == 1) {
//     return '';
//   }

//   // Length truncation
//   str = str.trim();
//   if (str.length > maxTextLength && printFull == 0) {
//     str = `${str.slice(0, maxTextLength).trim()}...`;
//   }

//   // Capitalization
//   const delims = [' ', '.', '('];
//   for (let i = 0; i < delims.length; i++) {
//     str = splitAndCapitalize(str, delims[i]);
//   }

//   return str;
// }

// export function splitAndCapitalize(str, splitChar) {
//   let tokens = str.split(splitChar);
//   tokens = tokens.map(function(token, idx) {
//     return capitalize(token, splitChar == ' ');
//   });

//   return tokens.join(splitChar);
// }

// export function capitalize(str, first) {
//   return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
// }

// // Determine if neighboring nodes
// export function neighbors(a, b) {
//   return linkedByIndex[a.index + ',' + b.index] 
//       || linkedByIndex[b.index + ',' + a.index]  
//       || a.index == b.index;
// }

// export function reloadNeighbors() {
//   linkedByIndex = {};
//   links.forEach(function(d) {
//     linkedByIndex[d.source.index + "," + d.target.index] = true;
//   });
// }

// export function removeLink(removedNodes, link) {
//   /* takes in a list of removed nodes and the link to be removed
//       if the one of the nodes in the link target or source has actually been removed, remove the link and return it
//       if not, then don't remove */
//   let removedLink;
//   //only remove a link if it's attached to a removed node
//   if(removedNodes[link.source.id] === true || removedNodes[link.target.id] === true) { //remove all links connected to a node to remove
//     const index = links.indexOf(link);
//     removedLink = links.splice(index, 1)[0];
//   }

//   return removedLink;
// }

// export function reattachLink(link, newNodeId, removedNodes, nodeIdsToIndex) {
//   /* takes in a link, id of the new nodes, and a dict mapping ids of removed nodes to state
//       depending on whether the link source or target will be newNodeId,
//       create a new link with appropriate source/target mapping to index of the node
//       if neither the source nor target were in removedNodes, do nothing */
//   let linkid = globallinkid;
//   if (removedNodes[link.source.id] === true && removedNodes[link.target.id] !== true) {
//     //add new links with appropriate connection to the new group node
//     //source and target refer to the index of the node
//     links.push({id: linkid, source: nodeIdsToIndex[newNodeId], target: nodeIdsToIndex[link.target.id], type: 'multiple'});
//     globallinkid -= 1;
//   } else if (removedNodes[link.source.id] !== true && removedNodes[link.target.id] === true) {
//     links.push({id: linkid, source: nodeIdsToIndex[link.source.id], target: nodeIdsToIndex[newNodeId], type: 'multiple'});
//     globallinkid -=1;
//   }
// }

// export function moveLinksFromOldNodesToGroup(removedNodes, group) {
//   /* takes in an array of removedNodes and a group
//     removes links attached to these nodes
//     if the removed link was already attached to a group, don't add that link to the group's list of links 
//     (because we're not adding that node to the group's list of nodes)
//     if else, add that link to the group's list of links
//     then reattach the link */
//   const removedNodesDict = {};
//   const nodeIdsToIndex = {};

//   removedNodes.map((node) => {
//     removedNodesDict[node.id] = true;
//   });

//   nodes.map((node, i) => {
//     nodeIdsToIndex[node.id] = i; //map all nodeIds to their new index
//   });

//   links.slice().map((link) => {
//     const removedLink = removeLink(removedNodesDict, link);
//     if (removedLink) {
//       const groupids = Object.keys(groups).map((key) => { return parseInt(key); });
//       if (isInArray(link.target.id, groupids) || isInArray(link.source.id, groupids)) {
//         // do nothing if the removed link was attached to a group
//       } else {
//         group.links.push(removedLink);
//       }

//       reattachLink(link, group.id, removedNodesDict, nodeIdsToIndex);
//     }
//   });
// }

// export function isInArray(value, array) {
//   return array.indexOf(value) > -1;
// }

// export function removeNodesFromDOM(select) {
//   /* iterates through a select to remove each node, and returns an array of removed nodes */

//   const removedNodes = []
//   select
//     .each((d) => {
//       if (nodes.indexOf(d) === -1) {
//         console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", nodes);
//       } else {
//         removedNodes.push(d);
//         nodes.splice(nodes.indexOf(d),1);
//       }
//     });

//   return removedNodes
// }

// export function removeNodeLinksFromDOM(removedNodes) {
//   /* takes in an array of nodes and removes links associated with any of them
//       returns an arry of removed links */

//   const removedLinks = [];
//   let removedLink;
//   const removedNodesDict = {};

//   removedNodes.map((node) => {
//     removedNodesDict[node.id] = true;
//   })

//   links.slice().map((link) => {
//     removedLink = removeLink(removedNodesDict, link);
//     if (removedLink) {
//       removedLinks.push(removedLink);
//     }
//   });

//   return removedLinks;
// }

// export function createGroupFromSelect(select){
//   /* iterates through the items in select to create a new group with proper links and nodes stored.
//       if a node in the select is already a group, takes the nodes and links from that group and puts it in
//       the new group */

//   const groupId = globalnodeid;
//   const group = groups[groupId] = {links: [], nodes: [], id: groupId}; //initialize empty array to hold the nodes
  
//   select
//     .each((d) => {
//       if (groups[d.id]) { //this node is already a group
//         var newNodes = groups[d.id].nodes;
//         var newLinks = groups[d.id].links;
//         newNodes.map((node) => {
//           group.nodes.push(node); //add each of the nodes in the old group to the list of nodes in the new group        
//         });
//         newLinks.map((link) => {
//           group.links.push(link); //add all the links inside the old group to the new group
//         });
//       } else {
//         d.group = groupId;
//         group.nodes.push(d); //add this node to the list of nodes in the group
//       }
//     }); 

//   globalnodeid -=1;
//   return group;
// }

// // Fill group nodes blue
// export function fillGroupNodes() {
//   svg.selectAll('.node')
//     .classed('grouped', function(d) { return d.id < 0; });
// }

// // Reset all node/link opacities to 1
// export function resetGraphOpacity() {
//   isEmphasized = false;
//   node.style('stroke-opacity', 1)
//       .style('fill-opacity', 1);
//   link.style('stroke-opacity', 1);
// }

// // Sleep for duration ms
// export function sleep(duration) {
//   return new Promise((resolve) => setTimeout(resolve, duration));
// }

// // =================
// // DEBUGGING METHODS
// // =================

// export function isObject(input) {
//   return input !== null && typeof input === 'object';
// }

// export function printObject(object) {
//   console.log(JSON.stringify(object, null, 4));
// }
//   };