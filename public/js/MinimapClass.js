'use strict';

import * as d3 from 'd3';
import * as utils from './helpers/utils.js'
import { stopPropagation } from './helpers/mouseClicks.js'; 
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

    // minimap settings
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
    this.initialBoxTranslate = null;

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
      .on('zoom.minimap', this.zooming);

    this.container = this.svg.append('g') 
      .attr('class', 'minimap')
      .call(this.zoom);

    // image container
    this.image = this.container.append('g')
      .attr('id', 'svg-image')
      .on('click', stopPropagation)
      .on('dblclick', stopPropagation)
      .call(d3.behavior.drag()
        .on('dragstart', stopPropagation)
        .on('drag', stopPropagation)
        .on('dragend', stopPropagation)
      )
      .call(d3.behavior.zoom()
        .on('zoomstart', stopPropagation)
        .on('zoom', stopPropagation)
        .on('zoomend', stopPropagation)
      );

    // raster image snapshot of the SVG
    this.image.append('rect')
      .attr('id', 'minimap-box')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'white')
      .attr('stroke', '#545454')
      .attr('stroke-width', 1.5);

    // image currently is blank and contains no href
    this.image.append('svg:image')
      .attr('width', this.width)
      .attr('height', this.height);

    // contains the box showing which part of the minimap you're hovering over
    this.box = this.container.append('g')
      .attr('class', 'minimap-box')
      .on('click', stopPropagation)
      .on('dblclick', stopPropagation)
      .call(d3.behavior.zoom()
        .on('zoomstart', stopPropagation)
        .on('zoom', stopPropagation)
        .on('zoomend', stopPropagation)
      );

    this.box.append('rect')
      .attr('id', 'minimap-box-square')
      .attr('width', this.boxWidth) // When you remove the this. it overlays a weird minimap
      .attr('height', this.boxHeight);

    const drag = d3.behavior.drag()
      .on('dragstart', this.dragstart)
      .on('drag', this.dragging)
      .on('dragend', this.dragend);

    this.box.call(drag);
  }

  toggleMinimapVisibility() {
    this.container
      .style('display', this.isVisible ? 'none' : '');
    this.isVisible = !this.isVisible;
  }

  dragstart() {
    d3.event.sourceEvent.stopPropagation();

    // Get the starting translate
    const boxTranslate = utils.getXYFromTranslate(this.box.attr('transform'));
    this.boxX = boxTranslate[0];
    this.boxY = boxTranslate[1];

    this.graph.zoomstart(null, null);
  }

  dragging() {
    const e = d3.event;
    e.sourceEvent.stopPropagation();

    // move box to fit the drag
    this.boxX = this.getBoundingPositionX(this.boxX + e.dx);
    this.boxY = this.getBoundingPositionY(this.boxY + e.dy);

    this.box.attr('transform', 'translate(' + this.boxX + ',' + this.boxY + ')scale(' + 1 + ')');

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

      const targetTransform = utils.getXYFromTranslate(this.target.attr('transform'));

      this.boxX += -targetTransform[0]/(this.scale);
      this.boxY += -targetTransform[1]/(this.scale);

      const translate = [-targetTransform[0]/(this.scale), -targetTransform[1]/(this.scale)];
      
      this.box
        .attr('transform', 'translate(' + translate + ')scale(' + 1 + ')')
        .select('#minimap-box-square')
        .attr('width', this.boxWidth = this.boxWidth/this.scale)
        .attr('height', this.boxHeight = this.boxHeight/this.scale);      
    }
  }

  /** RENDER **/
  syncToSVG(targetSVG, x1, x2, y1, y2) {
    this.container.attr('transform', 'translate(' + this.positionX + ',' + this.positionY+ ')scale(' + 1 + ')');

    const translate = utils.getXYFromTranslate(this.target.attr('transform'));
    const scale = this.scale;

    // let boxX = this.xbound[0] > x1 ? this.xbound[0] - x1 : x1 - this.xbound[0];

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
    this.image.select('image').attr('xlink:href', image_url); 
  }

  initializeBoxToCenter(targetSVG, x1, x2, y1, y2) {
    this.container.attr('transform', 'translate(' + this.positionX + ',' + this.positionY+ ')scale(' + 1 + ')');
    
    const translate = utils.getXYFromTranslate(this.target.attr('transform'));
    const scale = this.scale;

    x1 = x1 * scale + translate[0];
    x2 = x2 * scale + translate[0];
    y1 = y1 * scale + translate[1];
    y2 = y2 * scale + translate[1];

    x1 -= MINIMAP_PADDING;
    x2 += MINIMAP_PADDING;
    y1 -= MINIMAP_PADDING;
    y2 += MINIMAP_PADDING;

    let svgWidth = x2 - x1;
    let svgHeight = y2 - y1;

    if (this.viewportWidth > svgWidth) {
      x1 = 0;
      x2 = this.viewportWidth;
      svgWidth = this.viewportWidth;
    } 

    if (this.viewportHeight > svgHeight) {
      y1 = 0;
      y2 = this.viewportHeight;
      svgHeight = this.viewportHeight;
    }

    // scale by the proportion of the actual SVG to the minimap, which is 300 px size
    this.boxWidth = (this.viewportWidth / svgWidth) * this.width;
    this.boxHeight = (this.viewportHeight / svgHeight) * this.height;    
    this.boxX = (this.width - this.boxWidth) / 2;
    this.boxY = (this.height - this.boxHeight) / 2;

    this.boxScale = Math.sqrt((this.viewportWidth * this.viewportHeight) / (this.boxWidth * this.boxHeight));

    this.box
      .select('#minimap-box-square')
      .attr('x', () => { return Math.max(0, Math.min(DEFAULT_MINIMAP_SIZE-this.boxWidth, this.boxX)); })
      .attr('y', () => { return Math.max(0, Math.min(DEFAULT_MINIMAP_SIZE-this.boxHeight, this.boxY)); })
      .attr('width', this.boxWidth)
      .attr('height', this.boxHeight);

    const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
    this.image.select('image').attr('xlink:href', image_url);
  }

  getBoundingPositionX(position) {
    const offset = (this.width-this.boxWidth)/2;
    return Math.max(-offset, Math.min(offset, position));
  }

  getBoundingPositionY(position) {
    const offset = (this.height-this.boxHeight)/2;
    return Math.max(-offset, Math.min(offset, position));
  }
}

export default Minimap;
