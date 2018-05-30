import * as d3 from 'd3';
import * as utils from './utils.js'

import { MAX_SCALE, GRID_LENGTH } from './constants.js'
import { getD3Event, findEntryById, processNodeName, isLeftClick, isRightClick, isGroup, then } from './utils.js';
import { resetDragLink } from './aesthetics.js';

// Click-drag node selection
export function brushstart() {
  this.isBrushing = true;
}

export function brushing() {
  var self = this;
  if (isRightClick()) {
    const extent = this.brush.extent();
    this.svg.selectAll('.node')
      .classed('selected', function (d) {
        const xPos = self.brushX.invert(d.x * self.zoomScale + self.zoomTranslate[0]);
        const yPos = self.brushY.invert(d.y * self.zoomScale + self.zoomTranslate[1]);
        const selected = (extent[0][0] <= xPos && xPos <= extent[1][0]
          && extent[0][1] <= yPos && yPos <= extent[1][1])
          || (this.classList.contains('selected') && d3.event.sourceEvent.ctrlKey);
        self.nodeSelection[d.index] = selected;
        return selected;
      });

    this.highlightLinksFromAllNodes();
  }
}

export function brushend() {
  this.brush.clear();
  this.svg.selectAll('.brush').call(this.brush);
  this.isBrushing = false;
}

// Single-node interactions
export function clicked(d, self, i) {
  if (d3.event.defaultPrevented) return;
  const node = d3.select(self);
  const fixed = !(node.attr('dragfix') == 'true');
  node.classed('fixed', d.fixed = fixed);
  this.force.resume();
  d3.event.stopPropagation();
}

export function rightclicked(node, d) {
  // const fixed = node.attr('dragfix') == 'true';
  // const selected = !(node.attr('dragselect') == 'true');
  // node.classed('fixed', d.fixed = fixed)
  //   .classed('selected', this.nodeSelection[d.index] = selected);
  // this.highlightLinksFromNode(node[0]);
  this.force.resume();
}

export function dblclicked(d) {
  if (isGroup(d)) {
    this.toggleGroupView(d.id);
  }

  if (utils.isExpandable(d)) {
    this.expandNodeFromData(d);
  }

  d3.event.stopPropagation();
}

// Click-drag node interactions
export function dragstart(d, self) {
  d3.event.sourceEvent.preventDefault();
  d3.event.sourceEvent.stopPropagation();
  d3.select('.context-menu').style('display', 'none');
  if (this.isEmphasized) this.resetGraphOpacity();

  this.isDragging = true;
  this.draggedNode = d;
  this.displayNodeInfo(d);
  const node = d3.select(self);
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .attr('dragdistance', 0);
}

export function dragging(d, self) {
  const node = d3.select(self);
  node
    .attr('cx', d.px = d.x = d3.event.x)
    .attr('cy', d.py = d.y = d3.event.y)
    .attr('dragdistance', parseInt(node.attr('dragdistance')) + 1);
}

export function dragend(d, self) {
  const node = d3.select(self);
  // if (!parseInt(node.attr('dragdistance')) && isRightClick()) {
  //   this.rightclicked(node, d);
  // }

  if (node.attr('dragdistance')) {
    node.classed('fixed', d.fixed = true);
  }

  this.isDragging = false;
  this.draggedNode = null;
  this.toRenderMinimap = true;
  this.tickCount = 0;
  this.force.resume();
}

export function mousedown(d, self) {
  d3.event.stopPropagation();
  // Disable drag for right clicks (all drag disabled in edit mode)
  if (!isLeftClick() && !this.editMode) {
    if (!this.dragCallback) { this.dragCallback = this.node.property('__onmousedown.drag')['_'] };
    this.node.on('mousedown.drag', null); 
  }

  if (isLeftClick()) { this.link.call(this.styleLink, false); }
  if (this.editMode) { this.mousedownNode = d; };
  this.dragDistance = 0;
  if (this.editMode) {
    this.dragLink
      .attr('tx1', d.x)
      .attr('ty1', d.y)
      .attr('tx2', d.x)
      .attr('ty2', d.y);
  }
}

export function mouseup(d, self) {
  d3.event.stopPropagation();
  // Reduce size of drag link focused node
  if (this.editMode && this.mousedownNode && d != this.mousedownNode) {
    const currNode = d3.select(self);
    currNode.select('circle')
      .attr('transform', '');

    const source = d, 
          target = this.mousedownNode,
          fwdLinkId = this.linkedById[source.id + ',' + target.id],
          bwdLinkId = this.linkedById[target.id + ',' + source.id];
    if (fwdLinkId) {
      // If link already exists, select it
      this.selectLink(source, target);
    } else if (bwdLinkId) {
      // If link exists in opposite direction, make it bidirectional and select it
      const currLink = findEntryById(this.links, bwdLinkId);
      currLink.bidirectional = true;
      this.link.filter((o) => { return o.id === bwdLinkId; })
        .call(this.styleLink, true);
    } else {
      // If link doesn't exist, create and select it
      this.addLink(source, target);
      this.selectLink(source, target);
    }
  }

  resetDragLink(this);
}

export function mouseover(d, self) {
  // Drag link node emphasis
  if (this.editMode && this.mousedownNode) {
    if (d != this.mousedownNode) {
      d3.select(self).select('circle')
        .attr('transform', 'scale(1.1)');
    } else {
      this.dragLink.style('visibility', 'hidden');
    }
  }

  if (!this.isDragging && !this.isBrushing && !this.editMode) {
    // Hovered node emphasis
    this.hoveredNode = d;
    this.fadeGraph(d);

    // Add link text
    //console.log(this.link.filter((l) => { return l.source === d || l.target === d; }))
    //console.log(utils.getData(this.link.filter((l) => { return l.source === d || l.target === d; })))
    this.updateLinkText(utils.getData(this.link.filter((l) => { return l.source === d || l.target === d; })))
      //.call(this.addLinkText);
    // this.addLinkText(this.links);

    // Text elongation
    if (this.printFull == 0) {
      d3.select(self)
        .select('.node-name')
        .text(utils.processNodeName(d.name ? d.name : (d.number ? d.number : d.address), this.printFull), 2)
        .call(this.nodeTextWrap, 2);
    }
  }

  // this.displayNodeInfo(d);
}

export function mouseout(d, self) {
  // Reset node emphasis
  this.hoveredNode = null;
  this.resetGraphOpacity();

  // Reduce size of focused node
  if (this.editMode && this.mousedownNode && d != this.mousedownNode) {
    d3.select(self).select('circle')
      .attr('transform', '');
  }

  // Show drag link
  if (this.editMode && this.mousedownNode) { this.dragLink.style('visibility', 'visible'); }

  // Remove link text
  if (!this.isDragging) this.updateLinkText([]);

  // Text truncation
  if (this.printFull != 1) {
    d3.select(self)
      .select('.node-name')
      .text((d) => { return d.group ? '' : utils.processNodeName(d.name ? d.name : (d.number ? d.number : d.address), this.printFull); })
      .call(this.nodeTextWrap, this.printFull);
  } 

  // Restore node drag functionality for future left clicks
  if (!this.editMode && !isLeftClick() && this.dragCallback) {
    this.node.on('mousedown.drag', this.dragCallback); 
    this.dragCallback = null;
  }
}

// Canvas mouse handlers
export function clickedCanvas() {
  resetDragLink(this);
  if (d3.event.defaultPrevented) return;
  if (this.dragDistance == 0) {
    const selection = this.svg.selectAll('.node.selected');
    this.addNodeToSelected(selection, d3.event);
  } else {
    this.dragDistance = 0;
  }
}

export function dragstartCanvas() {
  d3.select('.context-menu').style('display', 'none');
  if (this.editMode) d3.event.sourceEvent.preventDefault();
}

export function mousemoveCanvas(self) {
  const classThis = this;
  const e = d3.event;
  this.displayDebugTooltip(self);
  if (this.editMode && this.mousedownNode) {
    const currNode = this.node.filter(function(o) { return classThis.mousedownNode.id === o.id; });
    this.dragDistance++;
    this.dragLink
      .style('visibility', 'visible')
      .attr('tx2', e.x)
      .attr('ty2', e.y);
  }
}

export function mouseupCanvas(self) {
  this.mousedownNode = null;
}

// Link mouse handlers
export function mouseoverLink(d) {
  this.displayLinkInfo(d);
}

// Node text handlers
export function stopPropagation() {
  getD3Event().stopPropagation();
}

// SVG zoom & pan
export function zoomstart(d, self) {
  const e = d3.event;
  if (isRightClick()) {
    this.zoomTranslate = this.zoom.translate();
    this.zoomScale = this.zoom.scale();
  }

  this.isZooming = true;
  this.zoomTranslate = this.zoom.translate();
  this.zoomScale = this.zoom.scale();
}

export function zooming(d, self) {
  if (!isRightClick()) {
    const e = d3.event;
    this.performZoom(e.translate, e.scale); // perform the zoom with the translate and scale from the handlers triggered by the graph
  }
}

export function performZoom(translate, scale) {
  const transform = 'translate(' + (((translate[0] / scale) % GRID_LENGTH) - translate[0] / scale)
    + ',' + (((translate[1] / scale) % GRID_LENGTH) - translate[1] / scale) + ')scale(' + 1 + ')';
  this.svgGrid.attr('transform', transform);
  this.container.attr('transform', `translate(${translate})scale(${scale})`); 
}

export function zoomend(d, self) {
  this.svg.attr('cursor', 'move');
  if (isRightClick()) {
    this.zoom.translate(this.zoomTranslate);
    this.zoom.scale(this.zoomScale);
  }

  this.zoomTranslate = this.zoom.translate();
  this.zoomScale = this.zoom.scale();
  this.isZooming = false;
}

// Zoom button functionality
export function zoomButton(zoom_in) {
  var self = this;
  var scale = this.zoom.scale(),
    extent = this.zoom.scaleExtent(),
    translate = this.zoom.translate(),
    x = translate[0], y = translate[1],
    factor = zoom_in ? 1.3 : 1 / 1.3,
    targetScale = scale * factor;

  // If we're already at an extent, done
  if (targetScale === extent[0] || targetScale === extent[1]) { return false; }

  // If the factor is too much, scale it down to reach the extent exactly
  var clampedTargetScale = Math.max(extent[0], Math.min(extent[1], targetScale));
  if (clampedTargetScale != targetScale) {
    targetScale = clampedTargetScale;
    factor = targetScale / scale;
  }

  // Center each vector, stretch, then put back
  x = (x - this.center[0]) * factor + this.center[0];
  y = (y - this.center[1]) * factor + this.center[1];

  // Transition to the new view over 100ms
  this.isZooming = true;
  d3.transition().duration(100).tween("zoom", function () {
    var interpolate_scale = d3.interpolate(scale, targetScale),
        interpolate_trans = d3.interpolate(translate, [x, y]);
    return function (t) {
      self.zoom
          .scale(interpolate_scale(t))
          .translate(interpolate_trans(t));
      self.zoomTranslate = self.zoom.translate();
      self.zoomScale = self.zoom.scale();
      self.manualZoom();
    };
  }).each("end", () => {
    if (this.zoomPressed) this.zoomButton(zoom_in); 
    else this.isZooming = false;
    if (this.minimap) {
      this.minimap.zooming();
    }
  });


}

export function translateGraphAroundNode(d) {
  // Center each vector, stretch, then put back
  var x = this.center[0] > d.x ? (this.center[0] - d.x) : -1*(d.x-this.center[0]);
  var y = this.center[1] > d.y ? (this.center[1] - d.y) : -1*(d.y-this.center[1]);
  var translate = this.zoom.translate();
  var scale = this.zoom.scale();
  this.isZooming = true;
  var self = this;

  // Transition to the new view over 500ms
  d3.transition().duration(500).tween("translate", function () {
    var interpolateTranslate = d3.interpolate(translate, [x, y]);
    return function (t) {
      self.zoom
          .translate(interpolateTranslate(t));
      self.zoomTranslate = self.zoom.translate();
      self.zoomScale = self.zoom.scale();
      self.manualZoom();
    };
  }).call(then, () => { this.isZooming = false; });
}

export function translateGraphAroundId(id) {
  // Center each vector, stretch, then put back
  var d;
  this.nodes.map((node)=> { if (node.id === id) { d = node; } });
  if (d == null) { return; }
  var x = this.zoomScale*(this.center[0] > d.px ? (this.center[0] - d.px) : -1*(d.px-this.center[0]));
  var y = this.zoomScale*(this.center[1] > d.py? (this.center[1] - d.py) : -1*(d.py-this.center[1]));

  //console.log("this is where x is after: ", x, " and where y is after: ", y)
  this.isZooming = true;
  var translate = this.zoom.translate();
  var self = this;

  // Transition to the new view over 500ms
  d3.transition().duration(500).tween("translate", function () {
    var interpolateTranslate = d3.interpolate(translate, [x, y]);
    return function (t) {
      self.zoom
          .translate(interpolateTranslate(t));
      self.zoomTranslate = self.zoom.translate();
      self.zoomScale = self.zoom.scale();
      self.manualZoom();
    };
  }).call(then, () => { this.isZooming = false; });
}

export function manualZoom() {
  this.container.attr('transform', 'translate(' + this.zoom.translate() + ')scale(' + this.zoom.scale() + ')');
  const transform = 'translate(' + (((this.zoom.translate()[0] / this.zoom.scale()) % GRID_LENGTH) - this.zoom.translate()[0] / this.zoom.scale())
    + ',' + (((this.zoom.translate()[1] / this.zoom.scale()) % GRID_LENGTH) - this.zoom.translate()[1] / this.zoom.scale()) + ')scale(1)';
  this.svgGrid.attr('transform', transform);
}

export function disableZoom() {
  this.svg.on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);
}