import * as d3 from "d3";
import * as utils from "./utils.js";
import {MAX_HEIGHT} from "./constants.js";
var $ = require("jquery");

export function initializeTooltip() {
    $('body').append("<div id='node-tooltip'></div>");
    this.hideTooltip();
}

export function displayDebugTooltip(self) {
    if (!this.debug) {
        return;
    }
    const e = d3.event,
        data = {
            'eventX': e.x,
            'eventY': e.y,
            'mouseX': (e.x - this.zoomTranslate[0]) / this.zoomScale,
            'mouseY': (e.y - this.zoomTranslate[1]) / this.zoomScale
        };

    this.displayData('node-tooltip', 'Coordinate debugger', this.populateNodeInfoBody, data);
    $('#node-tooltip').show();
}

export function displayTooltip(d) {
    const attrs = ['id', 'name', 'type'];
    this.displayData('node-tooltip', utils.processNodeName(d.name), this.populateNodeInfoBody, d, attrs);
    this.moveTooltip(d);
    $('#node-tooltip').show();
}

export function moveTooltip(d) {
    const offset = 30;
    const xPos = d.x * this.zoomScale + this.zoomTranslate[0] + offset;
    const yPos = d.y * this.zoomScale + this.zoomTranslate[1] + offset;
    $('#node-tooltip').css('left', `${xPos}px`)
    .css('top', `${yPos}px`);
}

export function hideTooltip() {
    $('#node-tooltip').hide();
}

export function populateNodeInfoBody(targetId, info, attrs) {
    if (attrs && !this.debug) {
        for (let attr of attrs) {
            $(targetId).append(createInfoTextEntry(attr, info[attr]));
            if (typeof info[attr] === 'undefined' && info['type'] !== 'Document') {
                console.error(`${attr} is not a valid attribute.`);
            }
        }
    } else {
        for (let key in info) {
            $(targetId).append(createInfoTextEntry(key, info[key]));
        }
    }
}

export function displayData(targetId, titleText, populateBody) {
    $(`#${targetId}`).html('');

    const sectionTitle = this.createTitleElement(titleText);
    sectionTitle.id = `${targetId}-title`;
    const titleId = `#${sectionTitle.id}`;

    const sectionBody = document.createElement('div');
    sectionBody.id = `${targetId}-body`;
    const bodyId = `#${sectionBody.id}`;

    sectionTitle.onclick = () => {
        $(bodyId).css('max-height', $(titleId).hasClass('open') ? 0 : MAX_HEIGHT);
        $(titleId).toggleClass('open');
    }

    if (arguments.length > 3) {
        const args = Array.prototype.slice.call(arguments, 3);
        args.unshift(sectionBody);
        populateBody.apply(null, args);
    } else {
        populateBody(sectionBody);
    }

    $(`#${targetId}`).append(sectionTitle);
    $(`#${targetId}`).append(sectionBody);
}

export function createInfoTextEntry(key, value) {
    const leftText = createTextElement('tooltip-left', key);
    const rightText = createTextElement('tooltip-right', value);
    const contentEntry = createDivElement('content-entry');
    $(contentEntry).append(leftText);
    $(contentEntry).append(rightText);
    return contentEntry;
}

export function createTitleElement(title, close = false) {
    const titleElement = createDivElement('tooltip-title');
    const titleText = document.createElement('p');
    titleText.className = 'unselectable';
    titleText.innerHTML = title;
    $(titleElement).append(titleText);

    if (close) {
        const icon = document.createElement('i');
        icon.className = 'fa fa-close';
        $(titleElement).append(icon);
    }

    return titleElement;
}

export function createTextElement(className, text) {
    const textElement = createDivElement(className);
    textElement.innerHTML = text;
    return textElement;
}

export function createDivElement(className) {
    const divElement = document.createElement('div');
    divElement.className = className;
    return divElement;
}
