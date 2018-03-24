const width = 960,
      height = 500

const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

const force = d3.layout.force()
      .gravity(.03)
      .distance(100)
      .charge(-100)
      .size([width, height]);

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
      .call(force.drag().on("drag", dragged));

  node.append("circle")
      .attr("r","15")
      .call(force.drag()
        .on("dragstart", dragstart)
        .on("drag", dragged)
        .on("dragend", dragend)
      );

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
    .classed("active", true);
} 

function dragged(d) {
  d3.select(this)
    .attr("cx", d.x = d3.event.x)
    .attr("cy", d.y = d3.event.y);
}

function dragend(d) {
  console.log("de fire");
  d3.selectAll("circle")
    .classed("active", false);
}


      // .on("mousedown", function(d) {
      //   d3.select(this)
      //     .style("stroke", "#545454")
      //     .style("fill", "#545454")
      //     .classed("fixed", d.fixed = d3.event.ctrlKey);
      // })
      // .on("mouseup", function(d) { 
      //   if (0) {
      //     d3.select(this)
      //       .style("stroke", "#545454")
      //       .style("fill", "#545454")
      //   } else {
      //     d3.select(this)
      //       .style("stroke", "#aaaaaa")
      //       .style("fill", "#aaaaaa")
      //   }
      // });