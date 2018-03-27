var width = $(window).width() - 225,
    height = $(window).height() - 1,
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

var brush = d3.svg.brush()
  .on('brushstart', brushstart)
  .on('brush', brushing)
  .on('brushend', brushend)
  .x(brushX).y(brushY);

svg.append('g')
  .attr('class', 'brush')
  .call(brush);

const force = d3.layout.force()
      .gravity(.03)
      .distance(100)
      .charge(-100)
      .size([width, height]);

// Graph manipulation keycodes
d3.select('body')
  .on('keydown', function() {
    // u: Unpin selected nodes
    if (d3.event.keyCode == 85) {
      svg.selectAll('circle.selected')
        .each(function(d) { d.fixed = false; })
        .classed('fixed', false);
      force.start();
    }
  })

d3.json('data.json', function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll('.link')
      .data(json.links)
      .enter().append('line')
      .attr('class', 'link');

  var node = svg.selectAll('.node')
      .data(json.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .call(force.drag()
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );

  node.append('circle')
      .attr('r','15')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', clicked)
      .call(force.drag()
        .on('dragstart', dragstart)
        .on('drag', dragging)
        .on('dragend', dragend)
      );

  node.append('text')
      .attr('dx', 22)
      .attr('dy', '.35em')
      .text(function(d) { return d.name });

  force.on('tick', function() {
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  });
});

// Brush methods for click-drag node selection
function brushstart() {

}

function brushing() {
  var extent = brush.extent();
  svg.selectAll('circle')
    .classed('selected', function (d) {
      var xPos = brushX.invert(d.x);
      var yPos = brushY.invert(d.y);
      return (extent[0][0] <= xPos && xPos <= extent[1][0]
          && extent[0][1] <= yPos && yPos <= extent[1][1])
          || (this.classList.contains('selected') && d3.event.sourceEvent.ctrlKey);
    });
}

function brushend() {
  brush.clear();
  svg.selectAll('.brush').call(brush);
}

// Click method for single-node interactions
function clicked(d, i) {
  if (d3.event.defaultPrevented) return;
  var node = d3.select(this);
  var fixed = node.attr('dragfix') == 'true';
  var selected = node.attr('dragselect') == 'true';
  node
    .classed('fixed', d.fixed = (fixed == d3.event.ctrlKey))
    .classed('selected', selected != d3.event.ctrlKey);
  console.log(node);
  selectLinksByNode(node);
  force.start();
  d3.event.stopPropagation();
}

// Drag methods for click-drag node interactions
function dragstart(d) {
  var node = d3.select(this);
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .classed('active', true)
    .classed('fixed', d.fixed = true)
    .classed('selected', d3.event.sourceEvent.ctrlKey);
} 

function dragging(d) {
  d3.select(this)
    .attr('cx', d.x = d3.event.x)
    .attr('cy', d.y = d3.event.y);
}

function dragend(d) {
  d3.selectAll('circle')
    .classed('active', false);
}

function selectLinks(node) {
    svg.selectAll('.link')
      .style('stroke', function() {
        
      });
}