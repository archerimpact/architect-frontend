const width = $(window).width() - 300,
    height = $(window).height() + 50,
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

var node, link, nodes, links;

var nodeSelection = {};

const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

const brush = d3.svg.brush()
  .on('brushstart', brushstart)
  .on('brush', brushing)
  .on('brushend', brushend)
  .x(brushX).y(brushY);

svg.append('g')
  .attr('class', 'brush')
  .call(brush);

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
    .call(force.drag()
      .on('dragstart', dragstart)
      .on('drag', dragging)
      .on('dragend', dragend)
    );
    
  node.exit().remove();

  nodeEnter.append('circle')
    .attr('r','15')
    .attr('dragfix', false)
    .attr('dragselect', false)
    .on('click', clicked)
    .classed('fixed',function(d) {return d.fixed}) //whether it's classed fixed depends on whether it's fixed
    .call(force.drag()
      .on('dragstart', dragstart)
      .on('drag', dragging)
      .on('dragend', dragend)
    );
  nodeEnter.append('text')
    .attr('dx', 22)
    .attr('dy', '.35em')
    .text(function(d) { return d.name });

  force.start();   
}

// Click-drag node selection

function brushstart() {

}

function brushing() {
  const extent = brush.extent();
  svg.selectAll('circle')
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

function brushend() {
  brush.clear();
  svg.selectAll('.brush').call(brush);
}

// Single-node interactions
function clicked(d, i) {
  if (d3.event.defaultPrevented) return;
  const node = d3.select(this);
  const ctrlPressed = d3.event.ctrlKey.toString();
  const fixed = node.attr('dragfix') == ctrlPressed;
  const selected = node.attr('dragselect') != ctrlPressed;

  node
    .classed('fixed', d.fixed = fixed)
    .classed('selected', selected);
  nodeSelection[d.index] = selected;
  highlightLinksFromNode(node[0]);

  force.resume();
  d3.event.stopPropagation();
}

// Click-drag node interactions
function dragstart(d) {
  const node = d3.select(this);
  const selected = d3.event.sourceEvent.ctrlKey;
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .classed('active', true)
    .classed('fixed', d.fixed = true)
    .classed('selected', selected);
  nodeSelection[d.index] = selected;
  highlightLinksFromNode(node[0]);
} 

function dragging(d) {
  d3.select(this)
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
}

function dragend(d) {
  d3.selectAll('circle')
    .classed('active', false);
  force.resume();
}

// Graph manipulation keycodes
d3.select('body')
  .on('keydown', function() {
    // u: Unpin selected nodes
    if (d3.event.keyCode == 85) {
      svg.selectAll('circle.selected')
        .each(function(d) { d.fixed = false; })
        .classed('fixed', false);
      force.resume();
    }
  })

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
  svg.selectAll('circle.selected')
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
