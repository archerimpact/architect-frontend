import * as d3 from "d3";
import * as constants from "./constants.js";
import * as aesthetics from "./aesthetics.js";
import * as selection from "./selection.js";
import * as utils from "./utils.js";
import { findEntryById, getD3Event, isGroup, isLeftClick, isRightClick, then } from "./utils.js";

import { GRID_LENGTH } from "./constants.js";
import { resetDragLink } from "./aesthetics.js";

// Click-drag node selection
export function brushstart() {
    this.isBrushing = true;
}

export function brushing() {
    let self = this;
    if (isRightClick() || this.rectSelect) {
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
    const e = d3.event;
    e.stopPropagation();
    if (e.defaultPrevented) return;

    this.displayNodeInfo(d);
    const node = d3.select(self);
    if (!(e.ctrlKey || e.metaKey)) aesthetics.unclassAllNodesSelected.bind(this)();
    aesthetics.classNodeSelected.bind(this)(node, !(node.attr('dragselect') === 'true'));

    this.force.resume();
}

export function rightclicked(node, d) {
    this.force.resume();
}

export function dblclicked(d, self) {
    d3.event.stopPropagation();
    if (isGroup(d)) { this.toggleGroupView(d.id); }
    if (utils.isExpandable(d)) { this.expandNodeFromData(d); }
    const node = d3.select(self);
    node.classed('selected', false);
}

// Click-drag node interactions
export function dragstart(d, self) {
    d3.event.sourceEvent.preventDefault();
    d3.event.sourceEvent.stopPropagation();
    d3.select('.context-menu').style('display', 'none');
    if (this.isEmphasized) this.resetGraphOpacity();

    this.isDragging = true;
    this.draggedNode = d;
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
        .attr('dragdistance', parseInt(node.attr('dragdistance'), 10) + 1);
}

export function dragend(d, self) {
    const node = d3.select(self);
    if (parseInt(node.attr('dragdistance'), 10)) {
        node.classed('fixed', d.fixed = true);
    }

    // if (!parseInt(node.attr('dragdistance')) && isRightClick()) {
    //   this.rightclicked(node, d);
    // }
    
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
        if (!this.dragCallback) { this.dragCallback = this.node.property('__onmousedown.drag')['_']; }
        this.node.on('mousedown.drag', null);
    }

    this.dragDistance = 0;
    if (this.editMode) {
        this.mousedownNode = d;
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
    if (this.editMode && this.mousedownNode && d !== this.mousedownNode) {
        const currNode = d3.select(self);
        currNode.select('circle')
            .attr('transform', '');

        const source = d,
            target = this.mousedownNode,
            fwdLinkId = this.linkedById[source.id + ',' + target.id],
            bwdLinkId = this.linkedById[target.id + ',' + source.id];
        if (fwdLinkId) {
            // If link already exists, select it
            selection.selectLink.bind(this, source, target);
        } else if (bwdLinkId) {
            // If link exists in opposite direction, make it bidirectional and select it
            const currLink = findEntryById(this.links, bwdLinkId);
            currLink.bidirectional = true;
            this.link.filter((o) => { return o.id === bwdLinkId; })
                .call(this.styleLink, true);
        } else {
            // If link doesn't exist, create and select it
            this.addLink(source, target);
            selection.selectLink.bind(this, source, target);
        }
    }

    resetDragLink(this);
}

export function mouseover(d, self) {
    // Drag link node emphasis
    if (this.editMode && this.mousedownNode) {
        if (d !== this.mousedownNode) {
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
        this.updateLinkText(utils.getData(this.link.filter((l) => {
            return l.source === d || l.target === d;
        })));

        // Text elongation
        if (this.printFull === 0) {
            d3.select(self)
                .select('.node-name')
                .text(aesthetics.processNodeName(d.name ? d.name : (d.number ? d.number : d.address), this.printFull), 2)
                .call(this.wrapNodeText, 2);
        }
    }

    // this.displayNodeInfo(d);
}

export function mouseout(d, self) {
    // Reset node emphasis
    this.hoveredNode = null;
    this.resetGraphOpacity();

    // Reduce size of focused node
    if (this.editMode && this.mousedownNode && d !== this.mousedownNode) {
        d3.select(self).select('circle')
            .attr('transform', '');
    }

    // Show drag link
    if (this.editMode && this.mousedownNode) {
        this.dragLink.style('visibility', 'visible');
    }

    // Remove link text
    if (!this.isDragging) this.updateLinkText([]);

    // Text truncation
    if (this.printFull !== 1) {
        d3.select(self).select('.node-name')
            .text((d) => {
                return d.group ? '' : aesthetics.processNodeName(d.name ? d.name : (d.number ? d.number : d.address), this.printFull);
            })
            .call(this.wrapNodeText, this.printFull);
    }

    // Restore node drag functionality for future left clicks
    if (!this.editMode && !isLeftClick() && this.dragCallback) {
        this.node.on('mousedown.drag', this.dragCallback);
        this.dragCallback = null;
    }
}

// Canvas mouse handlers
export function clickedCanvas() {
    // Called at the end of canvas drag actions
    if (this.rectSelect || this.freeSelect) selectPointerTool.bind(this)();

    // Only execute if click action, not drag
    if (d3.event.defaultPrevented) return;
    aesthetics.unclassAllNodesSelected.bind(this)();
    if (this.editMode) {
        resetDragLink(this);
        if (this.dragDistance === 0) {
            this.addNodeToSelected(d3.event);
        } else {
            this.dragDistance = 0;
        }
    }
}

export function dragstartCanvas() {
    d3.select('.context-menu').style('display', 'none');
    if (this.editMode || this.rectSelect || this.freeSelect) d3.event.sourceEvent.preventDefault();
}

export function mousemoveCanvas(self) {
    // const classThis = this;
    const e = d3.event;
    this.displayDebugTooltip(self);
    if (this.editMode && this.mousedownNode) {
        // const currNode = this.node.filter(function(o) { return classThis.mousedownNode.id === o.id; });
        this.dragDistance++;
        this.dragLink
            .style('visibility', 'visible')
            .attr('tx2', e.x)
            .attr('ty2', e.y);
    }
}

// Currently being overwritten in initializeZoomButtons to enable zoom after using zoom buttons
export function mouseupCanvas(self) {
    this.mousedownNode = null;
}

export function lassoStart() {
    this.lasso.items().classed('selected', (d) => { return d.selected = false; });
    aesthetics.unclassAllNodesSelected.bind(this)();
}

export function lassoDraw() {
    // TODO: combine these lines for small performance increase by making isSelected a fxn
    aesthetics.unclassAllNodesSelected.bind(this)();
    aesthetics.classNodesSelected.bind(this)(this.lasso.items().filter((d) => { return d.possible === true; }), true);
}

export function lassoEnd() {
    aesthetics.unclassAllNodesSelected.bind(this)();
    aesthetics.classNodesSelected.bind(this)(this.lasso.items().filter((d) => { return d.selected === true; }), true);
};

// Link mouse handlers
export function mouseoverLink(d) {
    this.displayLinkInfo(d);
}

// Node text handlers
export function stopPropagation() {
    const e = getD3Event();
    if (e.stopPropagation) e.stopPropagation();
}

// SVG zoom & pan
export function zoomstart(d, self) {
    this.isZooming = true;
    this.zoomTranslate = this.zoom.translate();
    this.zoomScale = this.zoom.scale();
}

export function zooming(d, self) {
    if (isRightClick() || this.rectSelect || this.freeSelect) return;
    const e = d3.event;
    this.performZoom(e.translate, e.scale); // Perform the zoom with the translate and scale from the handlers triggered by the graph
}

export function performZoom(translate, scale) {
    const transform = 'translate(' + (((translate[0] / scale) % GRID_LENGTH) - translate[0] / scale)
        + ',' + (((translate[1] / scale) % GRID_LENGTH) - translate[1] / scale) + ')scale(' + 1 + ')';
    this.svgGrid.attr('transform', transform);
    this.container.attr('transform', `translate(${translate})scale(${scale})`);
}

export function zoomend(d, self) {
    this.svg.attr('cursor', 'move');
    if (isRightClick() || this.rectSelect || this.freeSelect) {
        this.zoom.translate(this.zoomTranslate);
        this.zoom.scale(this.zoomScale);
    }

    this.zoomTranslate = this.zoom.translate();
    this.zoomScale = this.zoom.scale();
    this.isZooming = false;
}

// Zoom button functionality
export function zoomButton(zoom_in) {
    let self = this;
    let scale = this.zoom.scale(),
        extent = this.zoom.scaleExtent(),
        translate = this.zoom.translate(),
        x = translate[0], y = translate[1],
        factor = zoom_in ? 1.3 : 1 / 1.3,
        targetScale = scale * factor;

    // If we're already at an extent, done
    if (targetScale === extent[0] || targetScale === extent[1]) {
        return false;
    }

    // If the factor is too much, scale it down to reach the extent exactly
    const clampedTargetScale = Math.max(extent[0], Math.min(extent[1], targetScale));
    if (clampedTargetScale !== targetScale) {
        targetScale = clampedTargetScale;
        factor = targetScale / scale;
    }

    // Center each vector, stretch, then put back
    x = (x - this.center[0]) * factor + this.center[0];
    y = (y - this.center[1]) * factor + this.center[1];

    // Transition to the new view over 100ms
    this.isZooming = true;
    d3.transition().duration(100).tween("zoom", function () {
        const interpolate_scale = d3.interpolate(scale, targetScale),
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
            this.minimap.zooming(this.zoomTranslate);
        }
    });
}

export function translateGraphAroundNode(d) {
    // Center each vector, stretch, then put back
    const x = this.center[0] > d.x ? (this.center[0] - d.x) : -1 * (d.x - this.center[0]);
    const y = this.center[1] > d.y ? (this.center[1] - d.y) : -1 * (d.y - this.center[1]);
    let translate = this.zoom.translate();
    // var scale = this.zoom.scale();
    this.isZooming = true;
    let self = this;

    // Transition to the new view over 500ms
    d3.transition().duration(500).tween("translate", function () {
        let interpolateTranslate = d3.interpolate(translate, [x, y]);
        return function (t) {
            self.zoom
                .translate(interpolateTranslate(t));
            self.zoomTranslate = self.zoom.translate();
            self.zoomScale = self.zoom.scale();
            self.manualZoom();
        };
    }).call(then, () => {
        this.isZooming = false;
    });
}

export function translateGraphAroundId(id) {
    // Center each vector, stretch, then put back
    let d;
    this.node.classed("selected", false)
        .filter(node => { if (node.id === id) { d = node; return node; }})
        .classed("selected", true);
    if (d === null) { return; }

    const centerX = this.center[0];
    const centerY = this.center[1];

    let x = d.x;
    let y = d.y;

    x = centerX > x ? (centerX - x) : (x - centerX);
    y = centerY > y ? (centerY - y) : (y - centerY);

    //console.log("this is where x is after: ", x, " and where y is after: ", y)
    this.isZooming = true;
    const translate = this.zoom.translate();
    const self = this;

    // x = x * this.zoomScale;
    // y = y * this.zoomScale;

    // this.center = [d.x, d.y]
    // Transition to the new view over 500ms
    d3.transition().duration(500).tween("translate", function () {
        const interpolateTranslate = d3.interpolate(translate, [x, y]);
        return function (t) {
            self.zoom
                .translate(interpolateTranslate(t));
            self.zoomTranslate = self.zoom.translate();
            self.zoomScale = self.zoom.scale();
            self.manualZoom();
        };
    }).call(then, () => {
        this.isZooming = false;
    });
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

// Toolbar selection tools
export function selectPointerTool() {
    d3.select('#' + constants.BUTTON_POINTER_TOOL_ID).classed('selected', true);
    d3.select('#' + constants.BUTTON_RECT_SELECT_ID).classed('selected', false);
    d3.select('#' + constants.BUTTON_FREE_SELECT_ID).classed('selected', false);
    this.freeSelect = false;
    this.rectSelect = false;
    this.lasso.disable();
}

export function selectRectSelectTool() {
    d3.select('#' + constants.BUTTON_POINTER_TOOL_ID).classed('selected', false);
    d3.select('#' + constants.BUTTON_RECT_SELECT_ID).classed('selected', true);
    d3.select('#' + constants.BUTTON_FREE_SELECT_ID).classed('selected', false);
    this.freeSelect = false;
    this.rectSelect = true;
    this.lasso.disable();
}

export function selectFreeSelectTool() {
    d3.select('#' + constants.BUTTON_POINTER_TOOL_ID).classed('selected', false);
    d3.select('#' + constants.BUTTON_RECT_SELECT_ID).classed('selected', false);
    d3.select('#' + constants.BUTTON_FREE_SELECT_ID).classed('selected', true);
    this.freeSelect = true;
    this.rectSelect = false;
    this.lasso.enable();
}
