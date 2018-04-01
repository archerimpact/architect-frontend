const height = $(window).height(),
    width = Math.max($(window).width() - 300, height),
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

let node, link, hull, nodes, links, hulls;
let globallinkid = -1;
let globalnodeid = -1;

//store groupNodeId --> {links: [], nodes: [], groupid: int}
const groups = {}
//store groupNodeId --> expansion state
const expandedGroups = {}
// store all links and nodes that are hidden
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

// Setting up zoom
const minScale = 0.5;
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
      .call(zoom)
      .append('g');

const svgBrush = svg.append('g')
  .attr('class', 'brush')
  .call(brush);

// Draw gridlines
const svgGrid = svg.append('g');
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

const curve = d3.svg.line()
  .interpolate("cardinal-closed")
  .tension(.85);

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

d3.json('test_data/34192.json', function(json) {

  nodes = json.nodes
  links = json.links
  hulls = []

//  Needed this code when loading 43.json to prevent it from disappearing forever by pinning the initial node
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
    .gravity(1 / json.nodes.length)
    .charge(-1 * Math.max(Math.pow(json.nodes.length, 2), 750))
    .friction(json.nodes.length < 15 ? .75 : .65)
    .nodes(nodes)
    .links(links);

  // Create selectors
  hull = svg.append("g").selectAll(".hull")  
  link = svg.append("g").selectAll(".link");
  node = svg.append("g").selectAll(".node");

  // Updates nodes and links according to current data
  update();

  force.on('tick', ticked);
  // Avoid initial chaos and skip the wait for graph to drift back onscreen
  for (let i = 750; i > 0; --i) force.tick();

});

function update(){
  link = link.data(links, function(d) { return d.id; }); //resetting the key is important because otherwise it maps the new data to the old data in order
  link
    .enter().append("line")
    .attr("class", "link");

  link.exit().remove(); 

  node = node.data(nodes, function(d){ return d.id; });
  node.enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', clicked)
      .on('mouseover', mouseover)
      .on('mouseout', mouseout)
      .classed('fixed', function(d){ return d.fixed; })
      .call(force.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );
  
  node.append('circle')
      .attr('r','15');

  node.append('text')
      .attr('dx', 22)
      .attr('dy', '.35em')
      .attr('pointer-events', 'none')
      .text(function(d) { return d.name; });

  node.exit().remove();
  hull = hull.data(hulls)

  hull
    .enter().append('path')
    .attr('class', 'hull')
    .attr('d', drawHull)
    .on('click', function(d) {
      collapseHull(d);
      update();
    })
  hull.exit().remove();

  force.start();
  reloadNeighbors(); // TODO: revisit this and figure out WHY d.source.index --> d.source if this is moved one line up  
}

// Occurs each tick of simulation
function ticked() {
  force.resume();
  if (!hull.empty()) {
    calculateAllHulls()
    hull.data(hulls)
      .attr("d", drawHull)  
  }
  link.attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });

  node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
}

// Click-drag node selection
function brushstart() {
  console.log('brush')
  isBrushing = true;
}

function brushing() {
  if (isRightClick()) {
    const extent = brush.extent();
    svg.selectAll('.node')
      .classed('selected', function (d) {
        const xPos = brushX.invert(d.x);
        const yPos = brushY.invert(d.y);
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
  console.log('hi')
  const fixed = node.attr('dragfix') == 'true';
  const selected = !(node.attr('dragselect') == 'true');
  node.classed('fixed', d.fixed = fixed)
      .classed('selected', nodeSelection[d.index] = selected);
  highlightLinksFromNode(node[0]);
  force.resume();
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
  if (isEmphasized) mouseout();
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
      .style('fill-opacity', .4);

    link.style('stroke-opacity', function(o) {
      return (o.source == d || o.target == d) ? 1 : .05;
    });
  }
}

function mouseout() {
  node.style('stroke-opacity', 1)
      .style('fill-opacity', 1);
  link.style('stroke-opacity', 1);
  isEmphasized = false;
}

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
    const transform = "translate(" + (((e.translate[0]/e.scale) % gridLength) - e.translate[0]/e.scale)
      + "," + (((e.translate[1]/e.scale) % gridLength) - e.translate[1]/e.scale) + ")scale(" + 1 + ")";
    svgGrid.attr("transform", transform);
    svg.attr("transform", "translate(" + e.translate + ")scale(" + e.scale + ")");
  }
}

function zoomend() {
  if (isRightClick()) {
    zoom.translate(zoomTranslate);
    zoom.scale(zoomScale);
  }
} 

// Graph manipulation keycodes
d3.select('body')
  .on('keydown', function() {
    // u: Unpin selected nodes
    if (d3.event.keyCode == 85) {
      svg.selectAll('.node.selected')
        .each(function(d) { d.fixed = false; })
        .classed('fixed', false);
      force.resume();
    }

    // g: Group selected nodes
    else if (d3.event.keyCode == 71) {
      groupSelectedNodes();
      force.resume();
    }

    // h: Ungroup selected nodes
    else if (d3.event.keyCode == 72) {
      deleteSelectedGroups();
      force.resume();
    }

    // r: Remove selected nodes
    else if (d3.event.keyCode == 82 || d3.event.keyCode == 46) {
      removeSelectedNodes();
      force.resume();
    }

    // a: Add node linked to selected
    else if (d3.event.keyCode == 65) {
      addNodeToSelected();
      force.resume();
    }

    // d: hide document nodes
    else if (d3.event.keyCode == 68) {
      toggleDocumentView();
      force.resume();
    }
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

// ------------------------------------------------------------
// HELPER FUNCTIONS START
//

function removeNode(removedNodes, node) {
  let removedNode;
  var groupIds = Object.keys(groups)
  
  //remove node if it's in the dictionary of removed nodes
  if (removedNodes[node.id] === true) {
    const index = nodes.indexOf(node); //get the index on the spot in case removing elements changed the index
    removedNode = nodes.splice(index, 1)[0]; //splice modifies the original data
    if (isInArray(node.id, groupIds)) {
      delete groups[node.id]
    }
  }
  return removedNode;
}

function removeLink(removedNodes, link) {
  let removedLink;
  
  //only remove a link if it's attached to a removed node
  if(removedNodes[link.source.id] === true || removedNodes[link.target.id] === true) { //remove all links connected to a node to remove
    const index = links.indexOf(link);
    removedLink = links.splice(index, 1)[0];
  }
  return removedLink;
}

function reattachLink(link, newNodeId, removedNodes, nodeIdsToIndex) {
  let linkid = globallinkid;
  if (removedNodes[link.source.id] === true && removedNodes[link.target.id] !== true) {
    //add new links with appropriate connection to the new group node
    //source and target refer to the index of the node
    links.push({id: linkid, source: nodeIdsToIndex[newNodeId], target: nodeIdsToIndex[link.target.id]});
    globallinkid -= 1;
  } else if (removedNodes[link.source.id] !== true && removedNodes[link.target.id] === true) {
    links.push({id: linkid, source: nodeIdsToIndex[link.source.id], target: nodeIdsToIndex[newNodeId]});
    globallinkid -=1;
  }
}

function moveLinksFromOldNodesToGroup(removedNodes, group, nodeIdsToIndex) {
  links.slice().map((link) => {
    const removedLink = removeLink(removedNodes, link);
    if (removedLink) {
      const groupids = Object.keys(groups).map((key) => {return parseInt(key)})
      if (isInArray(link.target.id, groupids) || isInArray(link.source.id, groupids)) {
        // do nothing if the removed link was attached to a group

      } else {
        group.links.push(removedLink);
      }
    }
    reattachLink(link, group.id, removedNodes, nodeIdsToIndex);
  });
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

//
// HELPER FUNCTIONS END
// ------------------------------------------------------------

// Multi-node manipulation methods
function removeSelectedNodes() {
  const removedNodes = {}; //dictionary that maps node ids to whether they should be removed
  svg.selectAll('.node.selected')
    .each((d) => {
      removedNodes[d.id] = true;
      if (nodes.indexOf(d) === -1) {
        console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", nodes);
      }
    });
  nodes.slice().map((node) => {
    removeNode(removedNodes, node)
  });

  links.slice().map((link) => {
    removeLink(removedNodes, link)
  });

  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  update();

}

function addNodeToSelected(){
  const nodeid = globalnodeid;
  const linkid = globallinkid;
  const newnode = {id: nodeid, name: `Node ${-1*nodeid}`, type: "Custom"}

  globalnodeid -= 1;
  nodes.push(newnode)
  var select = svg.selectAll('.node.selected')

  if (select[0].length === 0) { //if nothing is selected, don't add a node for now because it flies away
    return
  }

  select
    .each((d) => {
      links.push({id: globallinkid, source: nodes.length-1, target: nodes.indexOf(d)})
      globallinkid -= 1;
    })
  node.classed("selected", false);
  link.classed("selected", false)
  nodeSelection = {}
  update();
}

function toggleDocumentView() {
  if (hidden.links.length === 0 && hidden.nodes.length ===0) { //nothing is hidden, hide them
    hideDocumentNodes();
  } else {
    showHiddenNodes();
  }
}

function hideDocumentNodes() {
  var select = svg.selectAll('.node')
    .filter((d) => {
      if (d.type === "Document") {
        return d
      }
    })
  hideNodes(select);
  update();
}

function hideNodes(select) {
  const removedNodes = {};
  const nodeIdsToIndex = {};
  select
    .each((d)=>{
      hidden.nodes.push(d)
      removedNodes[d.id] = true;
      nodes.splice(nodes.indexOf(d),1);
    })
  links.slice().map((link)=>{
    const removedLink = removeLink(removedNodes, link);
    if (removedLink) {
      hidden.links.push(removedLink)
    }
  })
}

function showHiddenNodes() {
  hidden.nodes.slice().map((node) => {
    nodes.push(node)
  })
  hidden.links.slice().map((link)=> {
    links.push(link)
  })
  update();
  hidden.links =[];
  hidden.nodes = [];
}

function groupSelectedNodes() {
  const removedNodes = {};
  const nodeIdsToIndex = {};
  const groupId = globalnodeid;
  const group = groups[groupId] = {links: [], nodes: [], id: groupId}; //initialize empty array to hold the nodes
  const removedGroups = []

  var select = svg.selectAll('.node.selected')

  if (select[0].length <= 1) { //do nothing if nothing is selected & if there's one node
    return
  }
  select
    .each((d) => {
      if (groups[d.id]) { //this node is already a group
        var newNodes = groups[d.id].nodes;
        var newLinks = groups[d.id].links
        newNodes.map((node) => {
          group.nodes.push(node); //add each of the nodes in the old group to the list of nodes in the new group        
        });
        newLinks.map((link) => {
          group.links.push(link); //add all the links inside the old group to the new group
        })
      } else {
        group.nodes.push(d); //add this node to the list of nodes in the group
      }
      removedNodes[d.id] = true; //remove this node from the DOM
      nodes.splice(nodes.indexOf(d), 1);
    }); 

  nodes.push({id: groupId, name: `Group ${-1*groupId}`}); //add the new node for the group
  nodes.map((node, i) => {
    nodeIdsToIndex[node.id] = i; //map all nodeIds to their new index
  });

  moveLinksFromOldNodesToGroup(removedNodes, group, nodeIdsToIndex)

  select.each((d)=> {
    // delete any groups that were selected AFTER all nodes & links are deleted
    // and properly inserted into the global variable entry for the new group
    delete groups[d.id]
  })

  globalnodeid -=1;
  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  update();
  displayGroupInfo(groups);
}

function deleteSelectedGroups() {
  var select = svg.selectAll('.node.selected')

  expandSelectedGroupNodes()

  select.each((d) => {
    delete groups[d.id] //delete this group from the global groups
  })

  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  node.classed("selected", false)
  $('#sidebar-group-info').trigger('contentchanged');
  update();
  displayGroupInfo(groups);
}

function expandSelectedGroupNodes() {
  const removedNodes = {}
  svg.selectAll('.node.selected')
    .each((d) => {
      const group = groups[d.id]
      if (group) { //this node is a group
        removedNodes[d.id] = true; //this is a node to be removed from the DOM
        nodes.splice(nodes.indexOf(d), 1)//remove this group node
        group.nodes.map((node) => {
          nodes.push(node) //add all nodes in the group to global nodes
        })
        group.links.map((link) => {
          links.push(link) //add all links in the group to global links
        })
      }
    })
  links.slice().map((link)=> {
    removeLink(removedNodes, link)  
  })
}

function collapseGroupNodes(group) {
  const removedNodes = {};
  const nodeIdsToIndex = {};
  const groupId = group.id; 
  const groupNodeIds = group.nodes.map((node) => {return node.id})

  svg.selectAll('.node')
    .each((d) => {
      if (isInArray(d.id, groupNodeIds)) {
        removedNodes[d.id] = true; //remove this node from the DOM
        nodes.splice(nodes.indexOf(d), 1);      
      }
    }); 

  nodes.push({id: groupId, name: `Group ${-1*groupId}`}); //add the new node for the group
  nodes.map((node, i) => {
    nodeIdsToIndex[node.id] = i //map all nodeIds to their new index
  });

  moveLinksFromOldNodesToGroup(removedNodes, group, nodeIdsToIndex)
}

function expandGroupNode(groupId) {
  force.stop()
  const remove = {}
  svg.selectAll('.node')
    .each((d) => {
      if (d.id === groupId && groups[d.id]) {
        const group = groups[d.id];
        remove[d.id] = true; //this is a node to be removed from the DOM
        nodes.splice(nodes.indexOf(d), 1)//remove this group node
        
        group.nodes.map((node) => {
          group.fixedX = d.x //store the coordinates of the group node
          group.fixedY = d.y
          node.x = node.px = group.fixedX + Math.floor(Math.random() * 200) + 1;
          node.y = node.py = group.fixedY + Math.floor(Math.random() * 200) + 1; 
          node.fixed = true;            
          nodes.push(node) //add all nodes in the group to global nodes
        })
        group.links.map((link) => {
          links.push(link) //add all links in the group to global links
        })
      }
    })
  links.slice().map((link)=> {
    removeLink(remove, link)    
  })
}

function toggleGroupView(groupId) {
  if (!groups[groupId]) {
    console.log("error, the group doesn't exist even when it should");
  }
  const group = groups[groupId]

  if (expandedGroups[groupId]) {
    collapseGroupNodes(group)
    hulls.map((hull, i) => {
      if (hull.groupId === groupId) {
        hulls.splice(i, 1) // remove this hull from the global list of hulls
      }
    })
    expandedGroups[groupId] = false;
  } else {
    expandGroupNode(groupId) 
    hulls.push(createHull(group))
    expandedGroups[groupId] = true;
  }
  $('#sidebar-group-info').trigger('contentchanged');
  update()
}


//Hull functions
function createHull(group) {
  var vertices = [];
  var offset = 30;
  group.nodes.map(function(d){
    vertices.push(
      [d.x + offset, d.y + offset], 
      [d.x - offset, d.y + offset], 
      [d.x - offset, d.y - offset], 
      [d.x + offset, d.y - offset]
    );
  });
  return {groupId: group.id, path: d3.geom.hull(vertices)}
}

function calculateAllHulls() {
  hulls.map((hull, i) => {
    hulls[i] = createHull(groups[hull.groupId])
  });
}

function drawHull(d) {
  return curve(d.path)
}
