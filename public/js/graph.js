const width = $(window).width() - 300,
    height = $(window).height() + 50,
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

const nodeSelection = {};

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


// Load data and init graph
d3.json('data.json', function(json) {
  force
      .gravity(1 / json.nodes.length)
      .charge(-1 * Math.max(Math.pow(json.nodes.length, 2), 750))
      .friction(json.nodes.length < 15 ? .75 : .9)
      .nodes(json.nodes)
      .links(json.links)
      .start();

  const link = svg.selectAll('.link')
      .data(json.links)
      .enter().append('line')
      .attr('class', 'link');

  const node = svg.selectAll('.node')
      .data(json.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', clicked)
      .call(force.drag()
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );

  node.append('circle')
      .attr('r','15');

  node.append('text')
      .attr('dx', 22)
      .attr('dy', '.35em')
      .text(function(d) { return d.name });

  force.on('tick', function() {
    force.resume();
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  });
});

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