
// Link highlighting
function highlightLinksFromAllNodes() {
  this.svg.selectAll('.link')
    .classed('selected', (d, i) => {
      return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index];
    });
}

function highlightLinksFromNode(node) {
  node = node[0].__data__.index;
  this.svg.selectAll('.link')
    .filter((d, i) => {
      return d.source.index == node || d.target.index == node;
    })
    .classed('selected', (d, i) => {
      return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index];
    });
}

// Fill group nodes blue
function fillGroupNodes() {
  this.svg.selectAll('.node')
    .classed('grouped', function (d) { return d.id < 0; });
}

// Reset all node/link opacities to 1
function resetGraphOpacity() {
  this.isEmphasized = false;
  this.node.style('stroke-opacity', 1)
    .style('fill-opacity', 1);
  this.link.style('stroke-opacity', 1);
}

// Wrap text
function textWrap(textSelection, printFull, width=100) {
  var self = this;
  textSelection.each(function (d) {
    const text = d3.select(this);
    const tokens = text.text().split(' ');
    text.text(null);

    let line = [];
    let remainder;
    let lineNum = 0;
    const dy = parseInt(text.attr('dy'));
    let tspan = text.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', dy)
      .classed('text-shadow', true);

    for (let i = 0; i < tokens.length; i++) {
      line.push(tokens[i]);
      tspan = tspan.text(line.join(' '));
      if (tspan.node().getComputedTextLength() > width) {
        remainder = (line.length > 1) ? line.pop() : null;
        tspan.text(line.join(' '));
        tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', 15 * (lineNum++) + dy)
          .text(line.join(' '));
          
        tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', 15 * lineNum + dy)
          .classed('text-shadow', true);

        line = remainder ? [remainder] : [];
      }

      if (printFull == 0 && lineNum > 0) { break; }
    }

    let finalLine = line.join(' ');
    finalLine = (printFull == 0 && lineNum > 0) ? `${finalLine.trim()}...` : finalLine;
    tspan.text(finalLine);
    tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', 15 * (lineNum++) + dy)
          .text(finalLine);
  });
}
