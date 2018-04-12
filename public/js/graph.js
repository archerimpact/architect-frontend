const height = $(window).height(),
    width = Math.max($(window).width() - 300, height),
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]),
    maxTextLength = 20;

let node, link, hull, nodes, links, hulls, nodeEnter;
let globallinkid = -1;
let globalnodeid = -1;

// FontAwesome icon unicode-to-node type dict
// Use this to find codes for FA icons: https://fontawesome.com/cheatsheet
const icons = {
  "person": "",
  "Document": "",
  "corporation": "",
  "group": ""
};

// Store groupNodeId --> {links: [], nodes: [], groupid: int}
const groups = {}
// Store groupNodeId --> expansion state
const expandedGroups = {}
// Store all links and nodes that are hidden
const hidden = {links: [], nodes: []}
// Store node.index --> selection state
let nodeSelection = {}; 
// Store each pair of neighboring nodes
let linkedByIndex = {}; 
// Keep track of dragging to disallow node emphasis on drag
let isDragging = false; 
let isBrushing = false;
// Keep track of node emphasis to end node emphasis on drag
let isEmphasized = false;
// Keep track of original zoom state to restore after right-drag
let zoomTranslate = [0, 0];
let zoomScale = 1;
// Allow user to toggle node text length
let printFull = 0;

// Setting up zoom
const minScale = 0.1;
const zoom = d3.behavior.zoom()
  .scaleExtent([minScale, 5])
  .on('zoomstart', zoomstart)
  .on('zoom', zooming)
  .on('zoomend', zoomend);

// Setting up brush
const brush = d3.svg.brush()
  .on('brushstart', brushstart)
  .on('brush', brushing)
  .on('brushend', brushend)
  .x(brushX).y(brushY);

// Create canvas
const svg = d3.select('#graph-container').append('svg')
      .attr('id', 'canvas')
      .attr('width', width)
      .attr('height', height)
      .call(zoom);

// Normally we append a g element right after call(zoom), but in this case we don't
// want panning to translate the brush off the screen (disabling all mouse events).
const svgBrush = svg.append('g')
  .attr('class', 'brush')
  .call(brush);

// We need this reference because selectAll and listener calls will refer to svg, 
// whereas new append calls must be within the same g, in order for zoom to work.
const container = svg.append('g');

//set up how to draw the hulls
const curve = d3.svg.line()
  .interpolate('cardinal-closed')
  .tension(.85);

// Draw gridlines
const svgGrid = container.append('g');
const gridLength = 80;
const numTicks = width / gridLength * (1/minScale);

svgGrid
  .append('g')
    .attr('class', 'x-ticks')
  .selectAll('line')
    .data(d3.range(0, (numTicks + 1) * gridLength, gridLength))
  .enter().append('line')
    .attr('x1', function(d) { return d; })
    .attr('y1', function(d) { return -1 * gridLength; })
    .attr('x2', function(d) { return d; })
    .attr('y2', function(d) { return (1/minScale) * height + gridLength; });

svgGrid
  .append('g')
    .attr('class', 'y-ticks')
  .selectAll('line')
    .data(d3.range(0, (numTicks + 1) * gridLength, gridLength))
  .enter().append('line')
  .attr('x1', function(d) { return -1 * gridLength; })
  .attr('y1', function(d) { return d; })
  .attr('x2', function(d) { return (1/minScale) * width + gridLength; })
  .attr('y2', function(d) { return d; });

// Extent invisible on left click
svg.on('mousedown', () => {
  svgBrush.style('opacity', isRightClick() ? 1 : 0);
});

// Disable context menu from popping up on right click
svg.on('contextmenu', function (d, i) {
  d3.event.preventDefault();
});

// Create force
const force = d3.layout.force()
      .linkDistance(90)
      .size([width, height]);

d3.json('data/sdn.json', function(json) {
  nodes = json.nodes
  links = json.links
  hulls = []

 // Needed this code when loading 43.json to prevent it from disappearing forever by pinning the initial node
// var index
//   nodes.map((node, i)=> {
//     if (node.id===43) {
//       index = i
//     }
//   })

//   nodes[index].fixed = true;
//   nodes[index].px = width/2
//   nodes[index].py = height/2; 

  force
    .gravity(.25)
    .charge(-1 * Math.max(Math.pow(json.nodes.length, 2), 750))
    .friction(json.nodes.length < 15 ? .75 : .65)
    .alpha(.8)
    .nodes(nodes)
    .links(links);

  // Create selectors
  hull = container.append('g').selectAll('.hull')  
  link = container.append('g').selectAll('.link');
  node = container.append('g').selectAll('.node');

  // Updates nodes and links according to current data
  update();

  force.on('tick', ticked);
  // Avoid initial chaos and skip the wait for graph to drift back onscreen
  for (let i = 750; i > 0; --i) force.tick();

});

function update(){
  link = link.data(links, function(d) { return d.id; }); //resetting the key is important because otherwise it maps the new data to the old data in order
  link
    .enter().append('line')
    .attr('class', 'link')
    .style('stroke-dasharray', function(d) { return d.type === 'possibly_same_as' ? ('3,3') : false; })
    .on('mouseover', mouseoverLink);

  link.exit().remove(); 

  node = node.data(nodes, function(d){ return d.id; });
  nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', clicked)
      .on('dblclick', dblclicked)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .classed('fixed', function(d){ return d.fixed; })
      .call(force.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );

  nodeEnter.append('circle')
      .attr('r', '20');  

  nodeEnter.append('text')
    .attr('class', 'icon')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-family', 'FontAwesome')
    .attr('font-size', '20px')
    .text(function(d) { return (d.type && icons[d.type]) ? icons[d.type] : ''; });

  nodeEnter.append('text')
    .attr('class', 'node-name')
    .attr('dx', 25)
    .attr('dy', '.45em')
    .text(function(d) { return processNodeName(d.name, printFull)})
    .on('click', clickedText)
    .on('mouseover', mouseoverText)
    .on('mouseout', mouseoutText)
    .call(d3.behavior.drag()
      .on('dragstart', dragstartText)
      .on('dragstart', draggingText)
      .on('dragstart', dragendText)
    );

  node.exit().remove();

  hull = hull.data(hulls)

  hull
    .enter().append('path')
    .attr('class', 'hull')
    .attr('d', drawHull)
    .on('dblclick', function(d) {
      toggleGroupView(d.groupId);
      d3.event.stopPropagation();
    })
  hull.exit().remove();

  force.start();
  reloadNeighbors(); // TODO: revisit this and figure out WHY d.source.index --> d.source if this is moved one line up  
}

// Occurs each tick of simulation
function ticked(e) {
  force.resume();
  if (!hull.empty()) {
    calculateAllHulls()
    hull.data(hulls)
      .attr('d', drawHull)  
  }
  node
    .each(groupNodesForce(.3))
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
}

function groupNodesForce(alpha){
  /* custom force that takes the parent group position as the centroid and moves all the nodes near */
  return function(d){
    if (d.group) {
      d.y += (d.cy - d.y) * alpha;
      d.x += (d.cx - d.x) * alpha;
    }
  }
}

// Click-drag node selection
function brushstart() {
  isBrushing = true;
}

function brushing() {
  if (isRightClick()) {
    const extent = brush.extent();
    svg.selectAll('.node')
      .classed('selected', function (d) {
        const xPos = brushX.invert(d.x * zoomScale + zoomTranslate[0]);
        const yPos = brushY.invert(d.y * zoomScale + zoomTranslate[1]);
        const selected = (extent[0][0] <= xPos && xPos <= extent[1][0]
                  && extent[0][1] <= yPos && yPos <= extent[1][1])
                  || (this.classList.contains('selected') && d3.event.sourceEvent.ctrlKey);
        nodeSelection[d.index] = selected;
        return selected;
      });

    highlightLinksFromAllNodes();
  }
}

function brushend() {
  brush.clear();
  svg.selectAll('.brush').call(brush);
  isBrushing = false;
}

// Single-node interactions
function clicked(d, i) {
  if (d3.event.defaultPrevented) return;
  const node = d3.select(this);
  const fixed = !(node.attr('dragfix') == 'true');
  node.classed('fixed', d.fixed = fixed);
  force.resume();
  d3.event.stopPropagation();
}

function rightclicked(node, d) {
  const fixed = node.attr('dragfix') == 'true';
  const selected = !(node.attr('dragselect') == 'true');
  node.classed('fixed', d.fixed = fixed)
      .classed('selected', nodeSelection[d.index] = selected);
  highlightLinksFromNode(node[0]);
  force.resume();
}

function dblclicked(d) {
  if (groups[d.id]) {
    toggleGroupView(d.id);
  }

  d3.event.stopPropagation();
}

// Click helper
function isRightClick() {
  return (d3.event && (d3.event.which == 3 || d3.event.button == 2))
      || (d3.event.sourceEvent && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2));
}

// Click-drag node interactions
function dragstart(d) {
  d3.event.sourceEvent.preventDefault();
  d3.event.sourceEvent.stopPropagation();
  if (isEmphasized) resetGraphOpacity();

  isDragging = true;
  displayNodeInfo(d);
  const node = d3.select(this);
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .attr('dragdistance', 0);

  node.classed('fixed', d.fixed = true); 
  if (isRightClick()) {
    node.classed('selected', nodeSelection[d.index] = true);
    highlightLinksFromNode(node[0]);
  }
} 

function dragging(d) {
  const node = d3.select(this);
  node
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y)
    .attr('dragdistance', parseInt(node.attr('dragdistance')) + 1);
  }

function dragend(d) {
  const node = d3.select(this);
  if (!parseInt(node.attr('dragdistance')) && isRightClick()) {
    rightclicked(node, d);
  }

  isDragging = false;
  force.resume();
}

// Node emphasis
function mouseover(d) {
  if (!isDragging && !isBrushing) {
    isEmphasized = true;
    node
      .filter(function(o) {
        return !neighbors(d, o);
      })
      .style('stroke-opacity', .15)
      .style('fill-opacity', .15);
    // .select('.node-name')
    //   .text(function(d) { return processNodeName(d.name, 1); });

    link.style('stroke-opacity', function(o) {
      return (o.source == d || o.target == d) ? 1 : .05;
    });

    if (printFull == 0) d3.select(this).select('.node-name').text(processNodeName(d.name, 2));
  }
}

function mouseout(d) {
  resetGraphOpacity();
  if (printFull != 1) d3.select(this).select('.node-name').text(function(d) { return processNodeName(d.name, printFull); });
}

// Zoom & pan
function zoomstart() {
  const e = d3.event;
  if (isRightClick()) {
    zoomTranslate = zoom.translate();
    zoomScale = zoom.scale();
  }
}

function zooming() {
  if (!isRightClick()) {
    const e = d3.event;
    const transform = 'translate(' + (((e.translate[0]/e.scale) % gridLength) - e.translate[0]/e.scale)
      + ',' + (((e.translate[1]/e.scale) % gridLength) - e.translate[1]/e.scale) + ')scale(' + 1 + ')';
    svgGrid.attr('transform', transform);
    container.attr('transform', 'translate(' + e.translate + ')scale(' + e.scale + ')');
  }
}

function zoomend() {
  svg.attr('cursor', 'move');
  if (isRightClick()) {
    zoom.translate(zoomTranslate);
    zoom.scale(zoomScale);
  }

  zoomTranslate = zoom.translate();
  zoomScale = zoom.scale();
} 

// Link mouse handlers
function mouseoverLink(d) {
  displayLinkInfo(d);
}

// Node text mouse handlers
function clickedText(d, i) {
  d3.event.stopPropagation();
}

function dragstartText(d) {
  d3.event.sourceEvent.stopPropagation();
}

function draggingText(d) {
  d3.event.sourceEvent.stopPropagation();
}

function dragendText(d) {
  d3.event.sourceEvent.stopPropagation();
}

function mouseoverText(d) {
  if (printFull == 0 && !isBrushing && !isDragging) {
    d3.select(this).text(processNodeName(d.name, 2));
  }

  d3.event.stopPropagation();
}

function mouseoutText(d) {
  if (printFull == 0 && !isBrushing && !isDragging) {
    d3.select(this).text(processNodeName(d.name, 0));
  }

  d3.event.stopPropagation();
}

// Graph manipulation keycodes
d3.select('body')
  .on('keydown', function() {
    // u: Unpin selected nodes
    if (d3.event.keyCode == 85) {
      svg.selectAll('.node.selected')
        .each(function(d) { d.fixed = false; })
        .classed('fixed', false);
    }

    // g: Group selected nodes
    else if (d3.event.keyCode == 71) {
      groupSelectedNodes();
    }

    // h: Ungroup selected nodes
    else if (d3.event.keyCode == 72) {
      ungroupSelectedGroups();
    }

    // r: Remove selected nodes
    else if (d3.event.keyCode == 82 || d3.event.keyCode == 46) {
      deleteSelectedNodes();
    }

    // a: Add node linked to selected
    else if (d3.event.keyCode == 65) {
      addNodeToSelected();
    }

    // d: Hide document nodes
    else if (d3.event.keyCode == 68) {
      toggleDocumentView();
    }

    // p: Toggle btwn full/abbrev text
    else if (d3.event.keyCode == 80) {
      printFull = (printFull + 1) % 3;
      selectAllNodeNames().text(function(d) { return processNodeName(d.name, printFull); });
    }

    force.resume()
  });

// Link highlighting
function highlightLinksFromAllNodes() {
  svg.selectAll('.link')
    .classed('selected', function(d, i) {
      return nodeSelection[d.source.index] && nodeSelection[d.target.index];
    });
}

function highlightLinksFromNode(node) {
  node = node[0].__data__.index;
  svg.selectAll('.link')
    .filter(function(d, i) {
      return d.source.index == node || d.target.index == node;
    })
    .classed('selected', function(d, i) {
      return nodeSelection[d.source.index] && nodeSelection[d.target.index];
    });
}

// Multi-node manipulation methods
function deleteSelectedNodes() {
  /* remove selected nodes from DOM
      if the node is a group, delete the group */
  var groupIds = Object.keys(groups);
  var select = svg.selectAll('.node.selected');
  let group;

  var removedNodes = removeNodesFromDOM(select);
  var removedLinks = removeNodeLinksFromDOM(removedNodes);

  removedLinks.map((link)=> { //remove links from their corresponding group
    if (link.target.group) {
      group = groups[link.target.group];
      group.links.splice(group.links.indexOf(link), 1);
    } if (link.source.group) {
      group = groups[link.source.group];
      group.links.splice(group.links.indexOf(link), 1);
    }
  });

  removedNodes.map((node) => {// remove nodes from their corresponding group & if the node is a group delete the group
    if (isInArray(node.id, groupIds)) {
      delete groups[node.id];
    }
    if (node.group) {
      group = groups[node.group];
      group.nodes.splice(group.nodes.indexOf(node), 1);
    }
  });

  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  update();
}

function addNodeToSelected(){
  /* create a new node using the globalnodeid counter
    for each node selected, create a link attaching the new node to the selected node
    remove highlighting of all nodes and links */
  const nodeid = globalnodeid;
  const newnode = {id: nodeid, name: `Node ${-1*nodeid}`, type: "Custom"};
  var select = svg.selectAll('.node.selected');
  if (select[0].length === 0) { return; } //if nothing is selected, don't add a node for now because it flies away

  globalnodeid -= 1;
  nodes.push(newnode);

  select
    .each((d) => {
      links.push({id: globallinkid, source: nodes.length-1, target: nodes.indexOf(d), type: "Custom"});
      globallinkid -= 1;
    })

  node.classed("selected", false);
  link.classed("selected", false);
  nodeSelection = {};
  update();
}

function toggleDocumentView() {
  if (hidden.links.length === 0 && hidden.nodes.length ===0) { //nothing is hidden, hide them
    hideDocumentNodes();
  } else {
    showHiddenNodes();
  }
  update();
}

function hideDocumentNodes() {
  var select = svg.selectAll('.node')
    .filter((d) => {
      if (d.type === "Document") { return d; }
    })

  hideNodes(select);
}

function hideNodes(select) {
  /* remove nodes
      remove links attached to the nodes
      push all the removed nodes & links to the global list of hidden nodes and links */

  const removedNodes = removeNodesFromDOM(select);
  const removedLinks = removeNodeLinksFromDOM(removedNodes);
  removedNodes.map((node)=> {
    hidden.nodes.push(node)
  });
  removedLinks.map((link)=>{
    hidden.links.push(link)
  });
}

function showHiddenNodes() {
  /* add all hidden nodes and links back to the DOM display */

  hidden.nodes.slice().map((node) => { nodes.push(node); });
  hidden.links.slice().map((link)=> { links.push(link); });

  hidden.links =[];
  hidden.nodes = [];
}

function groupSelectedNodes() {
  /* turn selected nodes into a new group, then delete the selected nodes and 
  move links that attached to selected nodes to link to the node of the new group instead */
  var select = svg.selectAll('.node.selected');

  if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

  const group = createGroupFromSelect(select);
  const removedNodes = removeNodesFromDOM(select);
  nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: "group"}); //add the new node for the group
  moveLinksFromOldNodesToGroup(removedNodes, group);

  select.each((d)=> { delete groups[d.id]; });
    // delete any groups that were selected AFTER all nodes & links are deleted
    // and properly inserted into the global variable entry for the new group

  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  update();
  fillGroupNodes();
  displayGroupInfo(groups);
}

function ungroupSelectedGroups() {
  /* expand nodes and links in the selected groups, then delete the group from the global groups dict */
  var select = svg.selectAll('.node.selected')
    .filter((d)=>{
      if (groups[d.id]){ return d; }
    });

  const newNodes = expandGroups(select, centered=false);
  newNodes.map((node) => { node.group=null }); //these nodes no longer have a group
  select.each((d) => { delete groups[d.id]; }); //delete this group from the global groups 

  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  node.classed("selected", false)
  update();
  displayGroupInfo(groups);
}

function expandGroup(groupId) {
  /* expand the group of the groupId passed in*/
  var select = svg.selectAll('.node')
    .filter((d) => {
      if (d.id === groupId && groups[d.id]) { return d; }
    });

  expandGroups(select, centered=true);
}

function expandGroups(select, centered=false) {
  /* bring nodes and links from a group back to the DOM, with optional centering around the node of the group's last position */
  var newNodes = [];
  select
    .each((d) => {
      const group = groups[d.id];
      if (group) {
        group.nodes.map((node) => {
          if (centered) {
            group.fixedX = d.x; //store the coordinates of the group node
            group.fixedY = d.y;
            const offset = .5*45* Math.sqrt(group.nodes.length); // math to make the total area of the hull equal to 15*15 per node
            const xboundlower = group.fixedX - offset;
            const yboundlower = group.fixedY - offset;

            node.x = node.px = Math.floor(Math.random() * offset * 2) + xboundlower;
            node.y = node.py = Math.floor(Math.random() * offset * 2) + yboundlower; 
            node.cx = group.fixedX;
            node.cy = group.fixedY;
            //node.fixed = true;  
          }
          newNodes.push(node);
          nodes.push(node); //add all nodes in the group to global nodes
        });
        group.links.map((link) => {
          links.push(link); //add all links in the group to global links
        });
      }
    });

  const removedNodes = removeNodesFromDOM(select);
  removeNodeLinksFromDOM(removedNodes);
  return newNodes;
}

function collapseGroupNodes(groupId) {
  /* collapse nodes in a group into a single node representing the group */
  const group = groups[groupId];
  const groupNodeIds = group.nodes.map((node) => { return node.id; });

  var select = svg.selectAll('.node')
    .filter((d) => {
      if (isInArray(d.id, groupNodeIds)) { return d; }
    });

  const removedNodes = removeNodesFromDOM(select);
  nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: 'group'}); //add the new node for the group
  moveLinksFromOldNodesToGroup(removedNodes, group);
}

function toggleGroupView(groupId) {
  /* switch between viewing the group in expanded and collapsed state.
    When expanded, the nodes in the group will have a hull polygon encircling it */
  const group = groups[groupId];

  if (!group) {
    console.log("error, the group doesn't exist even when it should: ", groupId);
  }

  if (expandedGroups[groupId]) {
    collapseGroupNodes(groupId);
    hulls.map((hull, i) => {
      if (hull.groupId === groupId) {
        hulls.splice(i, 1); // remove this hull from the global list of hulls
      }
    })
    expandedGroups[groupId] = false;
  } else {
    expandGroup(groupId);
    hulls.push(createHull(group));
    expandedGroups[groupId] = true;
  }

  update();
  fillGroupNodes();
}

//Hull functions
function createHull(group) {
  var vertices = [];
  var offset = 20; //arbitrary, the size of the node radius
  group.nodes.map(function(d) {
    vertices.push(
      [d.x + offset, d.y + offset], // creates a buffer around the nodes so the hull is larger
      [d.x - offset, d.y + offset], 
      [d.x - offset, d.y - offset], 
      [d.x + offset, d.y - offset]
    );
  });

  return {groupId: group.id, path: d3.geom.hull(vertices)}; //returns a hull object
}

function calculateAllHulls() {
  /* calculates paths of all hulls in the global hulls list */
  hulls.map((hull, i) => {
    hulls[i] = createHull(groups[hull.groupId]);
  });
}

function drawHull(d) {
  return curve(d.path);
}

// =================
// SELECTION METHODS
// =================

// Get all node text elements
function selectAllNodeNames() {
  return d3.selectAll('text')
      .filter(function(d) { return d3.select(this).classed('node-name'); });
}

// ==============
// HELPER METHODS
// ==============

// Normalize node text to same casing conventions and length
// printFull states - 0: abbrev, 1: none, 2: full
function processNodeName(str, printFull) {
  if (!str || printFull == 1) {
    return '';
  }

  // Length truncation
  str = str.trim();
  if (str.length > maxTextLength && printFull == 0) {
    str = `${str.slice(0, maxTextLength).trim()}...`;
  }

  // Capitalization
  const delims = [' ', '.', '('];
  for (let i = 0; i < delims.length; i++) {
    str = splitAndCapitalize(str, delims[i]);
  }

  return str;
}

function splitAndCapitalize(str, splitChar) {
  let tokens = str.split(splitChar);
  tokens = tokens.map(function(token, idx) {
    return capitalize(token, splitChar == ' ');
  });

  return tokens.join(splitChar);
}

function capitalize(str, first) {
  return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
}

// Determine if neighboring nodes
function neighbors(a, b) {
  return linkedByIndex[a.index + ',' + b.index] 
      || linkedByIndex[b.index + ',' + a.index]  
      || a.index == b.index;
}

function reloadNeighbors() {
  linkedByIndex = {};
  links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = true;
  });
}

function removeLink(removedNodes, link) {
  /* takes in a list of removed nodes and the link to be removed
      if the one of the nodes in the link target or source has actually been removed, remove the link and return it
      if not, then don't remove */
  let removedLink;
  //only remove a link if it's attached to a removed node
  if(removedNodes[link.source.id] === true || removedNodes[link.target.id] === true) { //remove all links connected to a node to remove
    const index = links.indexOf(link);
    removedLink = links.splice(index, 1)[0];
  }

  return removedLink;
}

function reattachLink(link, newNodeId, removedNodes, nodeIdsToIndex) {
  /* takes in a link, id of the new nodes, and a dict mapping ids of removed nodes to state
      depending on whether the link source or target will be newNodeId,
      create a new link with appropriate source/target mapping to index of the node
      if neither the source nor target were in removedNodes, do nothing */
  let linkid = globallinkid;
  if (removedNodes[link.source.id] === true && removedNodes[link.target.id] !== true) {
    //add new links with appropriate connection to the new group node
    //source and target refer to the index of the node
    links.push({id: linkid, source: nodeIdsToIndex[newNodeId], target: nodeIdsToIndex[link.target.id], type: 'multiple'});
    globallinkid -= 1;
  } else if (removedNodes[link.source.id] !== true && removedNodes[link.target.id] === true) {
    links.push({id: linkid, source: nodeIdsToIndex[link.source.id], target: nodeIdsToIndex[newNodeId], type: 'multiple'});
    globallinkid -=1;
  }
}

function moveLinksFromOldNodesToGroup(removedNodes, group, ) {
  /* takes in an array of removedNodes and a group
    removes links attached to these nodes
    if the removed link was already attached to a group, don't add that link to the group's list of links 
    (because we're not adding that node to the group's list of nodes)
    if else, add that link to the group's list of links
    then reattach the link */
  const removedNodesDict = {};
  const nodeIdsToIndex = {};
  const existingLinks = {};

  removedNodes.map((node) => {
    removedNodesDict[node.id] = true;
  });

  nodes.map((node, i) => {
    nodeIdsToIndex[node.id] = i; //map all nodeIds to their new index
  });
  group.links.map((link)=>{
    existingLinks[link.target.id + ',' + link.source.id] = true;
  })

  links.slice().map((link) => {
    const removedLink = removeLink(removedNodesDict, link);
    if (removedLink) {
      const groupids = Object.keys(groups).map((key) => { return parseInt(key); });
      if (isInArray(link.target.id, groupids) || isInArray(link.source.id, groupids)) {
        // do nothing if the removed link was attached to a group
      } else if (existingLinks[link.target.id + ',' + link.source.id]) {
        //do nothing if the link already exists in the group, i.e. if you're expanding
      } else {
        group.links.push(removedLink);
      }
      reattachLink(link, group.id, removedNodesDict, nodeIdsToIndex);
    }
  });
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function removeNodesFromDOM(select) {
  /* iterates through a select to remove each node, and returns an array of removed nodes */

  const removedNodes = []
  select
    .each((d) => {
      if (nodes.indexOf(d) === -1) {
        console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", nodes);
      } else {
        removedNodes.push(d);
        nodes.splice(nodes.indexOf(d),1);
      }
    });

  return removedNodes
}

function removeNodeLinksFromDOM(removedNodes) {
  /* takes in an array of nodes and removes links associated with any of them
      returns an arry of removed links */

  const removedLinks = [];
  let removedLink;
  const removedNodesDict = {};

  removedNodes.map((node) => {
    removedNodesDict[node.id] = true;
  })

  links.slice().map((link) => {
    removedLink = removeLink(removedNodesDict, link);
    if (removedLink) {
      removedLinks.push(removedLink);
    }
  });

  return removedLinks;
}

function createGroupFromSelect(select){
  /* iterates through the items in select to create a new group with proper links and nodes stored.
      if a node in the select is already a group, takes the nodes and links from that group and puts it in
      the new group */

  const groupId = globalnodeid;
  const group = groups[groupId] = {links: [], nodes: [], id: groupId}; //initialize empty array to hold the nodes
  
  select
    .each((d) => {
      if (groups[d.id]) { //this node is already a group
        var newNodes = groups[d.id].nodes;
        var newLinks = groups[d.id].links;
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

  globalnodeid -=1;
  return group;
}

// Fill group nodes blue
function fillGroupNodes() {
  svg.selectAll('.node')
    .classed('grouped', function(d) { return d.id < 0; });
}

// Reset all node/link opacities to 1
function resetGraphOpacity() {
  isEmphasized = false;
  node.style('stroke-opacity', 1)
      .style('fill-opacity', 1);
  link.style('stroke-opacity', 1);
}

// Sleep for duration ms
function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

// =================
// DEBUGGING METHODS
// =================

function isObject(input) {
  return input !== null && typeof input === 'object';
}

function printObject(object) {
  console.log(JSON.stringify(object, null, 4));
}