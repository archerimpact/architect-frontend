const width = $(window).width() - 225,
    height = $(window).height(),
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]);

var node, link;

const nodeSelection = {};

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

d3.json('34192.json', function(json) {
    var nodes = json.nodes
    var links = json.links
    force
      .nodes(nodes)
      .links(links)


    //create selectors
    link = svg.append("g").selectAll(".link")
    node = svg.append("g").selectAll(".node")

    //updates nodes and links according to current data
    update(nodes, links)

  force.on('tick', function() {
    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

    node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  });
});

    function update(nodes, links){
      console.log("made i to update")

      link = link.data(links);

      //Access ENTER selection (hangs off UPDATE selection)
      //This represents newly added data that dont have DOM elements
      //so we create and add a "line" element for each of these data
      link
        .enter().append("line")
        .attr("class", "link")

      //Access EXIT selection (hangs off UPDATE selection)
      //This represents DOM elements for which there is now no corresponding data element
      //so we remove these from DOM
      link
          .exit().remove(); 

      node = node.data(nodes)
      node
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
      node.exit().remove();

      /*d3.selectAll("circle")
        .filter(function(d){ 
          console.log("d: ", d)
          console.log(d3.select(this))
          if (d.id == neo4j_id) {
            console.log("d.id: ", d.id)
            centerNode = d
          }
          return d.id == neo4j_id
        })
        .classed("center", true);*/

      d3.selectAll("circle")
        .filter(function(d){ 
          console.log("d: ", d)
          console.log(d3.select(this))
          if (d.type == "Document") {
            console.log("type: ", d.type)
          }
          return d.type == "Document"
        })
        .classed("documentNode", true)
        //.classed("centerNode", false)

      force.start();    

      /*link.classed("centerNode", function (o) {
        return o.source === centerNode || o.target === centerNode ? true : false; //highlight all connected links
      });
      node.classed("centerNode", function (o) {
        return neighboring (centerNode,o) ? true : false; //highligh connected nodes
      }); */         
    }

// Brush methods for click-drag node selection
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

  force.start();
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
  force.start();
}

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

// Update - add/remove nodes
function update() {

}