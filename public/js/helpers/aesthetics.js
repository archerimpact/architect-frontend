import * as d3 from 'd3';
import * as utils from './utils.js';

import { isGroup, then } from './utils.js';
import * as constants from './constants.js';
import * as colors from './colorConstants.js';

export function highlightExpandableNode(){
  this.node.classed('expandable', false)
  this.node.filter((d) => { if (utils.isExpandable(d)) { return d } })
    .classed('expandable', true)
}

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

export function styleNode(selection) {
  selection.select('circle')
    .attr('r', (d) => { return d.radius = (d.group ? constants.GROUP_NODE_RADIUS : constants.NODE_RADIUS); })
    .classed('hull-node', (d) => { return d.group; })
    .style('stroke', (d) => { return d.group ? colors.HEX_WHITE : getNodeColor(d); })
    .style('fill', (d) => { return d.group ? getNodeColor(d) : colors.HEX_LIGHT_GRAY; });

  selection.select('.icon')
    .style('fill', (d) => { return getNodeColor(d); });
}

export function getNodeColor(d) {
  return colors.NODE_COLORS[d.type] || colors.HEX_DARK_GRAY;
}

export function styleLink(selection, isSelected) {
  selection.classed('selected', isSelected);
  selection
    .style('stroke-width', (l) => { return (l.source.group && l.target.group ? constants.GROUP_STROKE_WIDTH : constants.STROKE_WIDTH) + 'px'; })
    .style('marker-start', (l) => { 
      if (!l.bidirectional) { return ''; }
      const size = l.target.group ? 'small' : 'big';
      const color = (typeof isSelected === 'function' ? isSelected(l) : isSelected) ? 'blue' : 'gray';
      return `url(#start-${size}-${color})`;
    })
    .style('marker-end', (l) => { 
      const size = l.source.group ? 'small' : 'big';
      const color = (typeof isSelected === 'function' ? isSelected(l) : isSelected) ? 'blue' : 'gray';
      return `url(#end-${size}-${color})`;
    });
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
    .classed('grouped', function (d) { return isGroup(d) || d.type === 'same_as_group'; });
}

export function fadeGraph(d) {
  this.isEmphasized = true;
  this.node
    .filter((o) => { return !this.areNeighbors(d, o); })
    .classed('faded', true);
  this.link.classed('faded', o => { return !(o.source == d || o.target == d); });
  this.hull.classed('faded', true);
}

// Reset all node/link opacities to 1
export function resetGraphOpacity() {
  this.isEmphasized = false;
  this.node.classed('faded', false);
  this.link.classed('faded', false);
  this.hull.classed('faded', false);
}

// Reset edit mode's dynamic drag link
export function resetDragLink(self) {
  self.mousedownNode = null;
  self.dragLink.style('visibility', 'hidden');
}

// Wrap text
export function nodeTextWrap(textSelection, printFull, width=100) {
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

    let i;
    for (i = 0; i < tokens.length; i++) {
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
    finalLine = (printFull == 0 && i < tokens.length) ? `${finalLine.trim()}...` : finalLine;
    tspan.text(finalLine);
    tspan = text.append('tspan')
          .attr('x', 0)
          .attr('y', 0)
          .attr('dy', 15 * (lineNum++) + dy)
          .text(finalLine)
          .classed('unselectable', true);
  });
}

export function addLinkText(selection) {
  console.log('selection', selection)
  console.log(this.linkContainer.selectAll('.link-text'))
  // console.log(this.svg.selectAll('.link-text'))
  // const linkText = this.link
  //   .filter((l) => { return l.source === this.hoveredNode || l.target === this.hoveredNode; })
  // this.linkText = this.link
  //   .data(selection, (l) => { return l.id; });

  // this.linkText.enter()
  //   .append('text')
  //   .attr('class', 'link-text')
  //   .attr('text-anchor', 'middle')
  //   .attr('dy', '.3em')
  //   .text(function (l) { return l.type; })
  //   .call(this.linkTextWrap);

  // this.linkText.exit().remove();
  this.linkText = this.linkContainer.selectAll('.link-text')
    .data(selection, (l) => { return l.id; });

  this.linkText.enter()
    .append('text')
      .attr('class', 'link-text')
      .attr('text-anchor', 'middle')
    .append('textPath')
      .attr('startOffset', '50%')
      .attr('alignment-baseline', 'ideographic')
      .attr('xlink:href', (l) => { return `#link-${l.id}`; })
      .text((l) => { return l.type; })

  this.linkText.exit().remove();
}

export function linkTextWrap(textSelection) {
  textSelection.each(function (d) {
    // Don't add link text to links within hulls
    const parentLink = d3.select(this.parentNode).select('path')[0][0].__data__;
    if (parentLink.source && parentLink.source.group && parentLink.source.group === parentLink.target.group) {
      d3.select(this).text(null);
      return;
    }

    // TODO: change this to reflect actual length of each link
    const width = (constants.LINK_DISTANCE + 2 * (constants.MARKER_PADDING + constants.MARKER_SIZE_BIG)) - 2*constants.NODE_RADIUS; 

    const text = d3.select(this);
    const numChars = width / 4;
    let linkText = text.text();
    linkText = linkText.substr(0, numChars) + (numChars < linkText.length ? '...' : '');
    text.text(null);

    let line = [];
    let remainder;
    let lineNum = 0;
    const dy = text.attr('dy');
    let tspan = text.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', dy)
      .classed('text-shadow', true)
      .classed('unselectable', true)
      .text(linkText);

    tspan = text.append('tspan')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', dy)
      .text(linkText)
      .classed('unselectable', true);
  });
}
