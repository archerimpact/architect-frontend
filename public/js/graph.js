const width = $(window).width() - 300,
    height = $(window).height() + 50,
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

var node, link, nodes, links;
var linkid = -1;

var groups = {}

var nodeSelection = {};

const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .on("contextmenu", function (d, i) {
        d3.event.preventDefault();
      });

// Setting up brush
const brush = d3.svg.brush()
  .on('brushstart', brushstart)
  .on('brush', brushing)
  .on('brushend', brushend)
  .x(brushX).y(brushY);

const svgBrush = svg.append('g')
  .attr('class', 'brush')
  .call(brush);

svg.on('mousedown', () => {
  svgBrush.style('opacity', d3.event.button == 2 ? 1 : 0);
});

// Create force
const force = d3.layout.force()
      .linkDistance(110)
      .size([width, height]);

d3.json('34192.json', function(json) {
    nodes = json.nodes
    links = json.links
    force
      .gravity(1 / json.nodes.length)
      .charge(-1 * Math.max(Math.pow(json.nodes.length, 2), 750))
      .friction(json.nodes.length < 15 ? .75 : .9)
      .nodes(nodes)
      .links(links)


    //create selectors

    link = svg.append("g").selectAll(".link")
    node = svg.append("g").selectAll(".node")


    //updates nodes and links according to current data
    update()

  force.on('tick', function() {
    force.resume();
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  });
});

function update(){
  
  link = link.data(links, function(d) {return d.id}); //resetting the key is important because otherwise it maps the new data to the old data in order

  link
    .enter().append("line")
    .attr("class", "link");

  link.exit().remove(); 

  node = node.data(nodes, function(d){return d.id});

  var nodeEnter = node
    .enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', clicked)
      .classed('fixed', function(d){return d.fixed})
      .call(force.drag()
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );


  nodeEnter.append('circle')
      .attr('r','15');

  nodeEnter.append('text')
      .attr('dx', 22)
      .attr('dy', '.35em')
      .text(function(d) { return d.name });
    
  node.exit().remove();

  force.start();   
}

// Click-drag node selection

function brushstart() {

}

function brushing() {
  if (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2) {
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
}

// Single-node interactions
function clicked(d, i) {
  if (d3.event.defaultPrevented) return;
  const node = d3.select(this);
  const fixed = !(node.attr('dragfix') == 'true');
  if (d3.event.which == 1 || d3.event.button == 0) {
    node.classed('fixed', d.fixed = fixed);
  }

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

// Click-drag node interactions
function dragstart(d) {
  const node = d3.select(this);
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .attr('dragdistance', 0)
    // .classed('active', true)

  node.classed('fixed', d.fixed = true);
  if (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2) {
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
  
  // d3.selectAll('circle')
  //   .classed('active', false);
  const node = d3.select(this);
  console.log('dragend', node)
  console.log('selected: '+node.classed('selected')+', dragselect: '+node.attr('dragselect'));
  if (!parseInt(node.attr('dragdistance')) && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2)) {
    rightclicked(node, d);
  }

  force.resume();
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

// Add/remove nodes
function restart() {

}

//remove selected nodes

function removeSelectedNodes() {
  var remove = {}; //dictionary that maps node ids to whether they should be removed
  svg.selectAll('.node.selected')
    .filter((d) => {
      remove[d.id]=true;
      if (nodes.indexOf(d) === -1) {
        console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", nodes)
      }
    });
  nodes.slice().map((node) => {
    if (remove[node.id] === true) {
      var index = nodes.indexOf(node); //get the index on the spot in case removing elements changed the index
      nodes.splice(index, 1); //splice modifies the original data
    }
  });
  links.slice().map((l) => {
    if(remove[l.source.id] === true || remove[l.target.id] === true) { //remove all links connected to a node to remove
      var index = links.indexOf(l);
      links.splice(index, 1);
    }
  });
  nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
  update();
}

function groupSelectedNodes() {
  var remove = {}
  var nodeIdsToIndex = {}
  var groupId = -1*(Object.keys(groups).length + 1) //when it's 0 groups, first index should be -1
  var groupItems = {links: [], nodes: []} //initialize empty array to hold the nodes
  groups[groupId] = groupItems
  var groupNodes = groupItems.nodes
  var groupLinks = groupItems.links

  svg.selectAll('.node.selected')
    .filter((d) => {
      if (groups[d.id]) { //this node is already a group
        var newNodes = groups[d.id].nodes
        newNodes.map((node)=>{
          groupNodes.push(node) //add each of the nodes in the old group to the list of nodes in the new group
        })
        remove[d.id] = true; //remove this node from the DOM
        nodes.splice(nodes.indexOf(d), 1)
      } else {
        groupNodes.push(d) //add this node to the list of nodes in the group
        remove[d.id] = true; //remove this node from the DOM
        nodes.splice(nodes.indexOf(d), 1)
      }
    }); 
  nodes.push({id: groupId, name: "Group " + -1*groupId}) //add the new node for the group
  nodes.map((node, i)=> {
    nodeIdsToIndex[node.id] = i //map all nodeIds to their new index
  })

  console.log("links before grouping: ", links)

  links.slice().map((l) => {
    if(remove[l.source.id] === true || remove[l.target.id] === true) { //remove all links connected to the old nodes
      var removedLink = links.splice(links.indexOf(l), 1);
      console.log("removed link: ", removedLink)
      groupLinks.push(removedLink[0])
    }
    if(remove[l.source.id] === true && remove[l.target.id] !== true) {
      //add new links with appropriate connection to the new group node
      //source and target refer to the index of the node
      links.push({id: linkid, source: nodeIdsToIndex[groupId], target: nodeIdsToIndex[l.target.id]})
      linkid -= 1
    } else if (remove[l.source.id] !== true && remove[l.target.id] === true){
      links.push({id: linkid, source: nodeIdsToIndex[l.source.id], target: nodeIdsToIndex[groupId]})
      linkid -=1
    }
  });
  console.log("links after grouping: ", links)
  $('#sidebar-group-info').trigger('contentchanged');
  update()
}

function ungroupSelectedNodes() {
  console.log("ungrouping")
  var remove = {}
  console.log("links before ungrouping: ", links)
  svg.selectAll('.node.selected')
    .filter((d) => {
      console.log("This is what we're ungrouping: ", d)
      if (groups[d.id]) { //this node is a group
        remove[d.id] = true; //this is a node to be removed from the DOM
        var groupNodes = groups[d.id].nodes
        nodes.splice(nodes.indexOf(d), 1)//remove this group node
        groupNodes.map((node) => {
          nodes.push(node) //add all nodes in the group to global nodes
        })

        var groupLinks = groups[d.id].links
        groupLinks.map((link) => {
          links.push(link) //add all links in the group to global links
        })
      }
      delete groups[d.id] //delete this group from the global groups
    })
  console.log("links: ", links)
  links.slice().map((l)=> {
    if (typeof(l.target) === "undefined" || typeof(l.source) === "undefined") {
      console.log("undefined l.source, l.source: ", l.source, " or undefined l.target: ", l.target, " and l: ", l)
    }
    if(remove[l.source.id] === true || remove[l.target.id] === true) { //remove all links connected to the old nodes
      links.splice(links.indexOf(l), 1);
    }      
  })
  $('#sidebar-group-info').trigger('contentchanged');
  update()
}
