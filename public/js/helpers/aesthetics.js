// Link highlighting
export function highlightLinksFromAllNodes() {
  this.link.call(this.styleLink, false);
  this.link.filter((d) => { return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index] })
    .call(this.styleLink, true);
}

export function highlightLinksFromNode(node) {
  node = node[0].__data__.index;
  this.link.filter((d) => { return d.source.index == node || d.target.index == node; })
    .call(this.styleLink, (d) => { return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index]; });
}

export function styleLink(selection, isSelected) {
  selection.classed('selected', isSelected)
    .style('marker-start', (d) => { return (d.bidirectional || false) ? ((typeof isSelected === 'function' ? isSelected(d) : isSelected) ? 'url(#start-arrow-blue)' : 'url(#start-arrow-gray)') : '' })
    .style('marker-end', (d) => { return (typeof isSelected === 'function' ? isSelected(d) : isSelected) ? 'url(#end-arrow-blue)' : 'url(#end-arrow-gray)' });
}

// Directions: forward, reverse, both
export function changeLinkDirectionality(selection, newDirection) {
  selection.each((d) => {
    if (d.bidirectional) {
      // Implement after matrix adjacency done
    }
  });
}

// Fill group nodes blue
export function fillGroupNodes() {
  this.svg.selectAll('.node')
    .classed('grouped', function (d) { return d.type === 'group' || d.type === 'same_as_group'; });
}

// Reset all node/link opacities to 1
export function resetGraphOpacity() {
  this.isEmphasized = false;
  this.node.style('stroke-opacity', 1)
    .style('fill-opacity', 1);
  this.link.style('opacity', 1);
}

// Reset edit mode's dynamic drag link
export function resetDragLink(self) {
  self.mousedownNode = null;
  self.dragLink.classed('hidden', true);
}

// Wrap text
export function textWrap(textSelection, printFull, width=100) {
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
      .classed('text-shadow', true)
      .classed('unselectable', true);

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
          .text(line.join(' '))
          .classed('unselectable', true);
          
        tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', 15 * lineNum + dy)
          .classed('text-shadow', true)
          .classed('unselectable', true);

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
          .text(finalLine)
          .classed('unselectable', true);
  });
}
