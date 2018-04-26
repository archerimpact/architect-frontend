import * as utils from './utils.js';
import { maxTextLength, minScale, maxScale, gridLength } from './constants.js'

// Click-drag node selection
export function brushstart() {
  this.isBrushing = true;
}

export function brushing() {
  var self = this;
  if (this.isRightClick()) {
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
  const fixed = node.attr('dragfix') == 'true';
  const selected = !(node.attr('dragselect') == 'true');
  node.classed('fixed', d.fixed = fixed)
    .classed('selected', this.nodeSelection[d.index] = selected);
  this.highlightLinksFromNode(node[0]);
  this.force.resume();
}

export function dblclicked(d) {
  if (this.groups[d.id]) {
    this.toggleGroupView(d.id);
  }

  d3.event.stopPropagation();
}

// Click helper
export function isRightClick() {
  return (d3.event && (d3.event.which == 3 || d3.event.button == 2))
    || (d3.event.sourceEvent && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2));
}

// Click-drag node interactions
export function dragstart(d, self) {
  d3.event.sourceEvent.preventDefault();
  d3.event.sourceEvent.stopPropagation();
  if (this.isEmphasized) this.resetGraphOpacity();

  this.isDragging = true;
  this.draggedNode = d;
  this.displayNodeInfo(d);
  const node = d3.select(self);
  node
    .attr('dragfix', node.classed('fixed'))
    .attr('dragselect', node.classed('selected'))
    .attr('dragdistance', 0);

  if (this.isRightClick()) {
    node.classed('selected', this.nodeSelection[d.index] = true);
    this.highlightLinksFromNode(node[0]);
  } else {
    node.classed('fixed', d.fixed = true);
  }
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
  if (!parseInt(node.attr('dragdistance')) && this.isRightClick()) {
    this.rightclicked(node, d);
  }

  this.isDragging = false;
  this.draggedNode = null;
  this.force.resume();
}

export function mouseover(d, self) {
  var classThis = this;
  if (!this.isDragging && !this.isBrushing) {
    // Node emphasis
    this.isEmphasized = true;
    this.hoveredNode = d;
    this.node
      .filter(function (o) {
        return !classThis.neighbors(d, o);
      })
      .style('stroke-opacity', .15)
      .style('fill-opacity', .15);

    this.link.style('opacity', function (o) {
      return (o.source == d || o.target == d) ? 1 : .05;
    });

    // Text elongation
    if (this.printFull == 0) {
      d3.select(self)
        .select('.node-name')
        .text(utils.processNodeName(d.name, 2))
        .call(this.textWrap, 2);
    }
  }

  this.displayNodeInfo(d);
}

export function mouseout(d, self) {
  this.hoveredNode = null;
  this.resetGraphOpacity();
  if (this.printFull != 1) {
    d3.select(self)
      .select('.node-name')
      .text((d) => { return utils.processNodeName(d.name, this.printFull); })
      .call(this.textWrap, this.printFull);
  }
}

// Canvas mouse handlers
export function clickedCanvas(self) {
  if (d3.event.defaultPrevented) return;
  if (this.editMode) {
    const selection = this.svg.selectAll('.node.selected');
    this.addNodeToSelected(selection, d3.event);
  }
}

export function dragstartCanvas() {
  d3.event.sourceEvent.preventDefault();
  d3.event.sourceEvent.stopPropagation();
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
  this.zoomTranslate = this.zoom.translate();
  this.zoomScale = this.zoom.scale();
}

export function zooming(d, self) {
  if (!this.isRightClick()) {
    const e = d3.event;
    const transform = 'translate(' + (((e.translate[0] / e.scale) % gridLength) - e.translate[0] / e.scale)
      + ',' + (((e.translate[1] / e.scale) % gridLength) - e.translate[1] / e.scale) + ')scale(1)';
    this.svgGrid.attr('transform', transform);
    this.container.attr('transform', `translate(${e.translate})scale(${e.scale})`);
  }
}

export function zoomend(d, self) {
  this.svg.attr('cursor', 'move');
  if (this.isRightClick()) {
    this.zoom.translate(this.zoomTranslate);
    this.zoom.scale(this.zoomScale);
  }

  this.zoomTranslate = this.zoom.translate();
  this.zoomScale = this.zoom.scale();
}

// Zoom button functionality
export function doZoom(zoom_in) {
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
  d3.transition().duration(100).tween("zoom", function () {
    var interpolate_scale = d3.interpolate(scale, targetScale),
        interpolate_trans = d3.interpolate(translate, [x, y]);
    return function (t) {
      self.zoom
          .scale(interpolate_scale(t))
          .translate(interpolate_trans(t));
      self.zoomTranslate = self.zoom.translate();
      self.zoomScale = self.zoom.scale();
      self.zoomingButton();
    };
  }).each("end", () => {
    if (this.zoomPressed) this.doZoom(zoom_in);
  });
}

export function translateGraphAroundNode(d) {
  // Center each vector, stretch, then put back
  var x = this.center[0] > d.x ? (this.center[0] - d.x) : -1*(d.x-this.center[0]);
  var y = this.center[1] > d.y ? (this.center[1] - d.y) : -1*(d.y-this.center[1]);
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
      self.zoomingButton();
    };
  })
}

export function translateGraphAroundId(id) {
  // Center each vector, stretch, then put back
  //d.x + (?) = this.center[0]
  // console.log("this is center[0]: ", this.center[0], " and this is d.px: ", d.px)
  // console.log("this is center[1]: ", this.center[1], " and this is d.py: ", d.py, " and this is height: ", this.height)
  var d;
  this.nodes.map((node)=> { if (node.id === id) { d = node; } });
  if (d == null) { return; }
  var x = this.zoomScale*(this.center[0] > d.px ? (this.center[0] - d.px) : -1*(d.px-this.center[0]));
  var y = this.zoomScale*(this.center[1] > d.py? (this.center[1] - d.py) : -1*(d.py-this.center[1]));

  //console.log("this is where x is after: ", x, " and where y is after: ", y)
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
      self.zoomingButton();
    };
  })
}

export function disableZoom() {
  this.svg.on("mousedown.zoom", null)
    .on("touchstart.zoom", null)
    .on("touchmove.zoom", null)
    .on("touchend.zoom", null);
}

export function zoomingButton() {
  this.container.attr('transform', 'translate(' + this.zoom.translate() + ')scale(' + this.zoom.scale() + ')');
  const transform = 'translate(' + (((this.zoom.translate()[0] / this.zoom.scale()) % gridLength) - this.zoom.translate()[0] / this.zoom.scale())
    + ',' + (((this.zoom.translate()[1] / this.zoom.scale()) % gridLength) - this.zoom.translate()[1] / this.zoom.scale()) + ')scale(1)';
  this.svgGrid.attr('transform', transform);
}
