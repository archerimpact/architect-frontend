import * as d3 from "d3";
import * as utils from "./helpers/utils.js";
import {stopPropagation} from "./helpers/mouseClicks.js";
import * as constants from "./helpers/constants.js";
import {DEFAULT_MINIMAP_SIZE, MINIMAP_PADDING} from "./helpers/constants.js";

class Minimap {
    constructor(svg) {
        this.scale = 1;
        this.zoom = null;
        this.target = null;
        this.container = null; // container for entire minimap
        this.clip = null;
        this.box = null; // gray box for snippet into the graph
        this.fill = null;
        this.image = null; // contains the actual svg image
        this.isVisible = false;

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
        this.widthOffset = 0; // Both for zoom on minimap
        this.heightOffset = 0;
    }

    setBounds = (targetSVG, x1, x2, y1, y2) => {
        this.targetSVG = targetSVG;
        this.xbound = [x1, x2];
        this.ybound = [y1, y2];
        return this;
    }

    setScale = (value) => {
        this.scale = value;
        return this;
    }

    setZoom = (value) => {
        this.zoom = value;
        return this;
    }

    setTarget = (value) => {
        this.target = value;
        return this;
    }

    setMinimapPositionX = (value) => {
        this.positionX = value;
        return this;
    }

    setMinimapPositionY = (value) => {
        this.positionY = value;
        return this;
    }

    setGraph = (value) => {
        this.graph = value;
        return this
    }

    initializeMinimap = (svg, width, height) => { // svg is the target SVG containing the graph    this.svg = svg;
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.svg = svg;

        this.zoom
            .on('zoom.minimap', this.zooming)

        d3.selectAll(`#${constants.BUTTON_ZOOM_IN_ID}, #${constants.BUTTON_ZOOM_OUT_ID}`)
            .on('mouseup', this.zooming)
            .on('mouseup', () => { this.graph.zoomPressed = false; })
            .on('mouseout', () => { this.graph.zoomPressed = false; });

        this.container = this.svg.append('g')
            .attr('class', 'minimap')
            .attr('width', this.width)
            .attr('height', this.height)
            .call(this.zoom);

        this.container.append('rect')
            .attr('id', 'minimap-frame')
            .attr('width', this.width)
            .attr('height', this.height);

        // Image container
        this.image = this.container.append('svg:image')
            .attr('id', 'svg-image')
            .attr('width', this.width)
            .attr('height', this.height)
            .on('click', () => {
                d3.select('.context-menu').style('display', 'none');
                stopPropagation();
            })
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

        this.clip = this.container.append('clipPath')
            .attr('id', 'minimap-select')
            .on('click', stopPropagation)
            .on('dblclick', stopPropagation)
            .call(d3.behavior.zoom()
                .on('zoomstart', stopPropagation)
                .on('zoom', stopPropagation)
                .on('zoomend', stopPropagation)
            );

        this.box = this.clip.append('rect')
            .attr('width', this.boxWidth)
            .attr('height', this.boxHeight)
            .attr('x', 0)
            .attr('y', 0)
            .on('click', stopPropagation)
            .on('dblclick', stopPropagation);

        this.fill = this.container.append('rect')
            .attr('id', 'minimap-select-fill')
            .attr('clip-path', 'url(#minimap-select)')
            .attr('width', this.width)
            .attr('height', this.height);   


        // this.clip = this.container.append('clipPath')
        //         .attr('id', 'minimap-clip')
        //     .append('rect')
        //         .attr('width', this.width)
        //         .attr('height', this.height)
        //         .attr('x', 0)
        //         .attr('y', 0)
        //         // .attr('x', this.positionX)
        //         // .attr('y', this.positionY);

        // // Contains the box showing which part of the minimap you're hovering over
        // this.box = this.container.append('g')
        //     .attr('id', 'minimap-selection-container')
        //     .attr('clip-path', 'url(#minimap-clip)')
        //     .on('click', stopPropagation)
        //     .on('dblclick', stopPropagation)
        //     .call(d3.behavior.zoom()
        //         .on('zoomstart', stopPropagation)
        //         .on('zoom', stopPropagation)
        //         .on('zoomend', stopPropagation)
        //     );

        // this.box.append('rect')
        //     .attr('id', 'minimap-selection')
        //     .attr('width', this.boxWidth)
        //     .attr('height', this.boxHeight);

        const drag = d3.behavior.drag()
            .on('dragstart', this.dragstart)
            .on('drag', this.dragging)
            .on('dragend', this.dragend);

        this.fill.call(drag);

        this.container.attr('transform', 'translate(' + this.positionX + ',' + this.positionY + ')scale(' + 1 + ')');
    }

    toggleMinimapVisibility = () => {
        this.container
            .style('display', this.isVisible ? 'none' : '');
        this.isVisible = !this.isVisible;
    }

    dragstart = () => {
        d3.event.sourceEvent.stopPropagation();
        d3.select('.context-menu').style('display', 'none');

        // Get the starting translate
        // const boxTranslate = utils.getXYFromTranslate(this.box.attr('transform'));
        // this.boxX = 0;
        // this.boxY = 0;

        this.graph.zoomstart(null, null);
    }

    dragging = () => {
        const e = d3.event;
        e.sourceEvent.stopPropagation();

        // Move box to fit the drag
        // this.boxX = this.getBoundingPositionX(this.boxX + e.dx);
        // this.boxY = this.getBoundingPositionY(this.boxY + e.dy);
        console.log(this.boxScale)
        this.boxX += e.dx / this.scale;
        this.boxY += e.dy / this.scale;
        console.log('before', this.box.attr('x'), this.box.attr('y'))
        this.box
            .attr('x', this.boxX)
            .attr('y', this.boxY);
        console.log('after', this.box.attr('x'), this.box.attr('y'))
        //this.box.attr('transform', 'translate(' + this.boxX + ',' + this.boxY + ')scale(' + 1 + ')');

        // Update clip
        // const clip = d3.select('#minimap-clip rect');
        // clip.attr('x', parseFloat(clip.attr('x')) + e.dx);
        // clip.attr('y', parseFloat(clip.attr('y')) + e.dy);

        // Calculate translate using ((this.width - this.boxWidth)/2, (this.height - this.boxHeight)/2) as origin
        const translate = [((this.width - this.boxWidth) / 2 - this.boxX) * this.boxScale * this.scale, ((this.height - this.boxHeight) / 2 - this.boxY) * this.boxScale * this.scale];
        this.graph.performZoom(translate, this.scale);
        this.zoom.translate(translate);
    }

    dragend = () => {
        this.graph.zoomend(null, null);
    }

    zooming = () => {
        console.log('JOOMING')
        this.scale = (d3.event && !utils.isRightClick()) ? d3.event.scale : utils.getScaleFromZoom(this.target.attr('transform'))[0];
        this.zoomMinimap();
    }

    zoomMinimap = () => {
        // const targetTransform = utils.getXYFromTranslate(this.target.attr('transform'));

        // this.boxX += -targetTransform[0] / (this.scale * this.boxScale);
        // this.boxY += -targetTransform[1] / (this.scale * this.boxScale);

        // Calculate translate from graph to minimap by scaling down graph translate and offsetting by origin
        const e = d3.event;
        this.boxX = -e.translate[0] / (this.scale * this.boxScale) + (this.width - this.boxWidth) / 2;
        this.boxY = -e.translate[1] / (this.scale * this.boxScale) + (this.height - this.boxHeight) / 2;

        //const translate = [-targetTransform[0] / (this.scale * this.boxScale), -targetTransform[1] / (this.scale * this.boxScale)];

        this.box
            //.attr('transform', 'translate(' + translate + ')scale(' + 1 + ')')
            .attr('x', this.boxX).attr('y', this.boxY)
            .attr('width', this.boxWidth / this.scale)
            .attr('height', this.boxHeight / this.scale);
    }

    /** RENDER **/
    syncToSVG = (targetSVG, x1, x2, y1, y2) => {
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

        let svgWidth = x2 > x1 ? x2 - x1 : 0;
        let svgHeight = y2 > y1 ? y2 - y1 : 0;

        const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
        this.image.attr('xlink:href', image_url);
    }

    initializeBoxToCenter = (targetSVG, x1, x2, y1, y2) => {
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

        let svgWidth = x2 > x1 ? x2 - x1 : 0;
        let svgHeight = y2 > y1 ? y2 - y1 : 0;

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

        //const initialTranslate = [Math.max(0, Math.min(DEFAULT_MINIMAP_SIZE - this.boxWidth, this.boxX)), Math.max(0, Math.min(DEFAULT_MINIMAP_SIZE - this.boxHeight, this.boxY))]
        this.box
            // .attr('transform', 'translate(' + initialTranslate + ')scale(' + 1 + ')')
            .attr('width', this.boxWidth)
            .attr('height', this.boxHeight)
            .attr('x', this.boxX)
            .attr('y', this.boxY);

        const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
        this.image.attr('xlink:href', image_url);

        this.widthOffset = (this.width - (this.boxWidth / this.scale)) / 2;
        this.heightOffset = (this.height - (this.boxHeight / this.scale)) / 2;
        console.log(this.boxX, this.boxY)
    }

    getBoundingPositionX = (position) => {
        const leftOffset = -this.widthOffset;
        const rightOffset = (this.width - (this.boxWidth / this.scale)) + leftOffset;
        return Math.max(Math.min(rightOffset, position), leftOffset);
    }

    getBoundingPositionY = (position) => {
        const topOffset = -this.heightOffset;
        const bottomOffset = (this.height - (this.boxHeight / this.scale)) + topOffset;
        return Math.max(Math.min(bottomOffset, position), topOffset);
    }
}

export default Minimap;
