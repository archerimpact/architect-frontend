'use strict';

import * as d3 from 'd3';
import * as utils from './helpers/utils.js'
import { GRID_LENGTH, MINIMAP_PADDING, DEFAULT_MINIMAP_SIZE } from './helpers/constants.js';

class Minimap {
  constructor(svg) {
    this.scale = 1;
    this.zoom = null;
    this.target = null;
    this.container = null; // container for entire minimap
    this.box = null; // gray box for snippet into the graph
    this.image = null; // contains the actual svg image
    this.isVisible = true;

    // minimap settins
    this.width = DEFAULT_MINIMAP_SIZE;
    this.height = DEFAULT_MINIMAP_SIZE;
    this.positionX = 0;
    this.positionY = 0;

    // minimap box settings
    this.boxWidth = DEFAULT_MINIMAP_SIZE;//0;
    this.boxHeight = DEFAULT_MINIMAP_SIZE;//0;
    this.boxX = 0;
    this.boxY = 0;
    this.boxScale = 1;

    this.initializeMinimap = this.initializeMinimap.bind(this);
    this.syncToSVG = this.syncToSVG.bind(this);

    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.zooming = this.zooming.bind(this);
  }

  setBounds(targetSVG, x1, x2, y1, y2) {
    this.targetSVG = targetSVG;
    this.xbound = [x1, x2];
    this.ybound = [y1, y2];
    return this;
  }

  setScale(value) {
    this.scale = value;
    return this;
  }

  setZoom(value) {
    this.zoom = value;
    return this;
  }

  setTarget(value) {
    this.target = value;
    return this;
  }

  setMinimapPositionX(value) {
    this.positionX = value;
    return this;
  }

  setMinimapPositionY(value) {
    this.positionY = value;
    return this;
  }

  setGraph(value) {
    this.graph = value;
    return this
  }

  initializeMinimap(svg, width, height) { // svg is the target SVG containing the graph    this.svg = svg;
    this.viewportWidth = width;
    this.viewportHeight = height;
    this.svg = svg;

    this.zoom
      .on("zoom.minimap", this.zooming);

    this.container = this.svg.append("g") 
      .attr("class", "minimap")
      .call(this.zoom);

    // image container
    this.image = this.container.append("g")
      .attr("id", "svg-image")
      .on("click", null)
      .on('dragstart', null)
      .on('drag', null)
      .attr('pointer-events', 'none');

    // raster image snapshot of the SVG
    this.image.append("rect")
      .attr("id", "minimap-box")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("fill", "white")
      .attr("stroke", "#545454")
      .attr("stroke-width", 1.5);

    // image currently is blank and contains no href
    this.image.append("svg:image")
      .attr("width", this.width)
      .attr("height", this.height);

    // contains the box showing which part of the minimap you're hovering over
    this.box = this.container.append("g")
        .attr("class", "minimap-box");

    this.box.append("rect")
      .attr("id", "minimap-box-square")
      .attr("width", this.boxWidth) // When you remove the this. it overlays a weird minimap
      .attr("height", this.boxHeight);

    var drag = d3.behavior.drag()
      .on("dragstart", this.dragstart)
      .on("drag", this.dragging)
      .on("dragend", this.dragend);

    this.box.call(drag);
  }

  toggleMinimapVisibility() {
    this.container
      .style('visibility', this.isVisible ? 'hidden' : 'visible');
    this.isVisible = !this.isVisible;
  }

  dragstart() {
    d3.event.sourceEvent.stopPropagation();

    // Get the starting translate
    var boxTranslate = utils.getXYFromTranslate(this.box.attr("transform"));
    this.boxX = boxTranslate[0];
    this.boxY = boxTranslate[1];

    this.graph.zoomstart(null, null);
  }

  dragging() {
    const e = d3.event;
    e.sourceEvent.stopPropagation();

    // move box to fit the drag
    this.boxX += e.dx;
    this.boxY += e.dy;

    this.box.attr("transform", "translate(" + this.boxX + "," + this.boxY + ")scale(" + 1 + ")");

    const translate = [-this.boxX*this.boxScale*this.scale, -this.boxY*this.boxScale*this.scale];
    this.graph.performZoom(translate, this.scale);
    this.zoom.translate(translate);
  }

  dragend() {
    this.graph.zoomend(null, null);
  }

  zooming() {
    if (!utils.isRightClick()) {
      this.scale = d3.event.scale;

      var targetTransform = utils.getXYFromTranslate(this.target.attr("transform"));

      this.boxX += -targetTransform[0]/(this.scale*this.boxScale);
      this.boxY += -targetTransform[1]/(this.scale*this.boxScale);

      let translate = [-targetTransform[0]/(this.scale*this.boxScale), -targetTransform[1]/(this.scale*this.boxScale)];
      
      this.box
        .attr("transform", "translate(" + translate + ")scale(" + 1 + ")")
        .select("#minimap-box-square")
        .attr("width", this.boxWidth/this.scale)
        .attr("height", this.boxHeight/this.scale);      
    }
  }

  /** RENDER **/
  syncToSVG(targetSVG, x1, x2, y1, y2) {
    this.container.attr("transform", "translate(" + this.positionX + "," + this.positionY+ ")scale(" + 1 + ")");

    var translate = utils.getXYFromTranslate(this.target.attr("transform"));
    var scale = this.scale;

    let boxX = this.xbound[0] > x1 ? this.xbound[0] - x1 : x1 - this.xbound[0];

    x1 = x1 * scale + translate[0];
    x2 = x2 * scale + translate[0];
    y1 = y1 * scale + translate[1];
    y2 = y2 * scale + translate[1];

    x1 -= MINIMAP_PADDING;
    x2 += MINIMAP_PADDING;
    y1 -= MINIMAP_PADDING;
    y2 += MINIMAP_PADDING;
    const svgWidth = x2 - x1;
    const svgHeight = y2 - y1;

    const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
    this.image.select("image").attr("xlink:href", image_url); 
  }

  initializeBoxToCenter(targetSVG, x1, x2, y1, y2) {
    this.container.attr("transform", "translate(" + this.positionX + "," + this.positionY+ ")scale(" + 1 + ")");
    
    var translate = utils.getXYFromTranslate(this.target.attr("transform"));
    var scale = this.scale;

    x1 = x1 * scale + translate[0];
    x2 = x2 * scale + translate[0];
    y1 = y1 * scale + translate[1];
    y2 = y2 * scale + translate[1];

    x1 -= MINIMAP_PADDING;
    x2 += MINIMAP_PADDING;
    y1 -= MINIMAP_PADDING;
    y2 += MINIMAP_PADDING;
    const svgWidth = x2 - x1;
    const svgHeight = y2 - y1;

    // scale by the proportion of the actual SVG to the minimap, which is 300 px size
    this.boxWidth = (this.viewportWidth / svgWidth) * this.width;
    this.boxHeight = (this.viewportHeight / svgHeight) * this.height;    
    this.boxX = (this.width - this.boxWidth) / 2;
    this.boxY = (this.height - this.boxHeight) / 2;

    this.boxScale = Math.sqrt((this.viewportWidth * this.viewportHeight) / (this.boxWidth * this.boxHeight));

    this.box
      .select("#minimap-box-square")
      .attr("x", this.boxX)
      .attr("y", this.boxY)
      .attr("width", this.boxWidth)
      .attr("height", this.boxHeight);

    const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
    this.image.select("image").attr("xlink:href", image_url);     
  }
}

export default Minimap;
