const width = 960,
      height = 500;

const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

let force = d3.layout.force()
      .gravity(.03)
      .distance(100)
      .charge(-100)
      .size([width, height]);

d3.select("body")
  .on("keydown", function() {
    // u: unpin selected nodes
    if (d3.event.keyCode == 85) {
      svg.selectAll("circle")
        .each(function(d) { d.fixed = false; })
        .classed("fixed", false);
    }
  });

d3.json("data.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
      .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag()
        .on("dragstart", dragstart)
        .on("drag", dragged)
        .on("dragend", dragend)
      );

  node.append("circle")
      .attr("r","15")
      .call(force.drag()
        .on("dragstart", dragstart)
        .on("drag", dragged)
        .on("dragend", dragend)
      )
      .on("mousedown", function(d) {
        d3.select(this)
          .classed("selected", d3.event.ctrlKey && !d3.select(this).classed("selected"));
      });

  node.append("text")
      .attr("dx", 22)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});

function dragstart(d) {
  d3.select(this)
    .classed("active", true)
    .classed("fixed", d.fixed = true);
} 

function dragged(d) {
  d3.select(this)
    .attr("cx", d.x = d3.event.x)
    .attr("cy", d.y = d3.event.y);
}

function dragend(d) {
  d3.selectAll("circle")
    .classed("active", false);
}
