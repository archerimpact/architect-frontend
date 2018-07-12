import * as d3 from "d3";
import * as utils from "./helpers/utils.js";
import { stopPropagation } from "./helpers/mouseClicks.js";
import * as constants from "./helpers/constants.js";
import { DEFAULT_MINIMAP_SIZE, MINIMAP_PADDING } from "./helpers/constants.js";

class Minimap {
    constructor(svg) {
        this.scale = 1;
        this.zoom = null;
        this.target = null;
        this.container = null; // Container for entire minimap
        this.clip = null; // Fills minimap semi-opaque gray color
        this.box = null; // Acts as minimap selection box, clips filled gray color
        this.image = null; // Contains the actual svg image of graph
        this.isVisible = false; // Option to hide minimap

        // Default minimap settings
        this.width = DEFAULT_MINIMAP_SIZE;
        this.height = DEFAULT_MINIMAP_SIZE;
        this.positionX = 0;
        this.positionY = 0;

        // Initial minimap box settings
        this.boxWidth = DEFAULT_MINIMAP_SIZE;
        this.boxHeight = DEFAULT_MINIMAP_SIZE;
        this.boxX = 0;
        this.boxY = 0;
        this.boxScale = 1;
        this.initialBoxTranslate = null;
        this.widthOffset = 0;
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

    initializeMinimap = (svg, width, height) => {
        this.viewportWidth = width;
        this.viewportHeight = height;
        this.svg = svg;

        this.zoom.on('zoom.minimap', this.zooming)

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

        this.image = this.container.append('svg:image')
            .attr('id', 'svg-image')
            .attr('width', this.width)
            .attr('height', this.height)
            .on('click', () => {
                d3.select('.context-menu').style('display', 'none');
                stopPropagation();

                // Reset minimap box and graph on click
                this.boxX = (this.width - this.boxWidth) / 2;
                this.boxY = (this.height - this.boxHeight) / 2;
                this.box
                    .attr('width', this.boxWidth)
                    .attr('height', this.boxHeight)
                    .attr('x', this.boxX)
                    .attr('y', this.boxY);

                this.graph.performZoom([0, 0], 1);
                this.zoom.translate([0, 0]);
                this.zoom.scale(1);
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

        this.container.append('rect')
            .attr('id', 'minimap-select-fill')
            .attr('clip-path', 'url(#minimap-select)')
            .attr('width', this.width)
            .attr('height', this.height) 
            .call(d3.behavior.drag()
                .on('dragstart', this.dragstart)
                .on('drag', this.dragging)
                .on('dragend', this.dragend)
            ); 

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
        this.graph.zoomstart(null, null);
    }

    dragging = () => {
        const e = d3.event;
        e.sourceEvent.stopPropagation();

        this.boxX += e.dx / this.scale;
        this.boxY += e.dy / this.scale;
        this.box
            .attr('x', this.boxX)
            .attr('y', this.boxY);

        // Calculate translate using ((this.width - this.boxWidth)/2, (this.height - this.boxHeight)/2) as origin
        const translate = [((this.width - this.boxWidth) / 2 - this.boxX) * this.boxScale * this.scale, ((this.height - this.boxHeight) / 2 - this.boxY) * this.boxScale * this.scale];
        this.graph.performZoom(translate, this.scale);
        this.zoom.translate(translate);
        this.boxCenterX = this.boxX + this.boxWidth/2;
        this.boxCenterY = this.boxY + this.boxHeight/2;
    }

    dragend = () => {
        this.graph.zoomend(null, null);
    }

    zooming = (currTranslate=null) => {
        if (!this.isVisible || (currTranslate === null && utils.isRightClick())) return;
        this.scale = d3.event ? d3.event.scale : utils.getScaleFromZoom(this.target.attr('transform'))[0];
        this.zoomMinimap(currTranslate);
    }

    zoomMinimap = (currTranslate=null) => {
        // Calculate translate from graph to minimap by scaling down graph translate and offsetting by origin
        console.log(this.boxX, this.boxY)
        const translateX = currTranslate ? currTranslate[0] : d3.event.translate[0];
        const translateY = currTranslate ? currTranslate[1] : d3.event.translate[1];
        this.boxX = -translateX / (this.scale * this.boxScale) + (this.width - this.boxWidth) / 2;
        this.boxY = -translateY / (this.scale * this.boxScale) + (this.height - this.boxHeight) / 2;
        this.box
            .attr('x', this.boxX).attr('y', this.boxY)
            .attr('width', this.boxWidth / this.scale)
            .attr('height', this.boxHeight / this.scale);
    }

    syncToSVG = (targetSVG, x1, x2, y1, y2) => {
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

        // Scale by the proportion of the actual SVG to the minimap, which is 300px
        this.boxWidth = (this.viewportWidth / svgWidth) * this.width;
        this.boxHeight = (this.viewportHeight / svgHeight) * this.height;
        this.boxX = (this.width - this.boxWidth) / 2;
        this.boxY = (this.height - this.boxHeight) / 2;

        this.boxScale = Math.sqrt((this.viewportWidth * this.viewportHeight) / (this.boxWidth * this.boxHeight));

        this.box
            .attr('width', this.boxWidth)
            .attr('height', this.boxHeight)
            .attr('x', this.boxX)
            .attr('y', this.boxY);

        const image_url = utils.createSVGImage(targetSVG, x1, x2, y1, y2, svgWidth, svgHeight);
        this.image.attr('xlink:href', image_url);

        this.widthOffset = (this.width - (this.boxWidth / this.scale)) / 2;
        this.heightOffset = (this.height - (this.boxHeight / this.scale)) / 2;
        this.toggleMinimapVisibility();
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
