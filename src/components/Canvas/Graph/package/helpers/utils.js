import * as d3 from "d3";
import {BELONGS_TO, DISPLAYED, GROUP_MEMBER, HIDDEN, NONEXISTENT} from "./matrixConstants.js";

import {GROUP, GROUP_HULL} from "./constants.js";

export function isMorePreferredState(val1, val2) {
    if (val1 === GROUP_MEMBER) { return false; }
    else if (val2 === GROUP_MEMBER) { return false; }
    else if (val1 === BELONGS_TO) { return true; }
    else if (val2 === BELONGS_TO) { return false; }
    else if (val1 === DISPLAYED) { return true; }
    else if (val2 === DISPLAYED) { return false; }
    else if (val1 === HIDDEN) { return true; }
}

export function isPossibleLink(val) {
    return (val.substring(0, 8).toLowerCase() === "possibly" || val === "MATCHED_NUMBER" || val === "MATCHED_NAME");
}

export function isVisibleNode(val) {
    return (val === DISPLAYED);
}

export function isGroup(d) {
    return (d.type === GROUP || d.type === GROUP_HULL);
}

export function getNewCoord(x, translate, scale) {
    return x + translate / scale;
}

export function isExpandable(d) {
    if (!d.totalLinks || !d.weight) return false;
    if (!d.linkTypes) return d.totalLinks > d.weight;

    let links = d.totalLinks;
    links = d.linkTypes.AKA ? links - d.linkTypes.AKA : links;
    links = d.linkTypes.SANCTIONED_ON ? links - d.linkTypes.SANCTIONED_ON : links;
    links = d.linkTypes.HAS_KNOWN_LOCATION ? links - d.linkTypes.HAS_KNOWN_LOCATION : links;
    return (links > d.weight);
}

export function getNumLinksToExpand(d) {
    if (!isExpandable(d)) return 0;
    return Math.max(d.totalLinks 
        - (d.linkTypes.AKA ? d.linkTypes.AKA : 0) 
        - (d.linkTypes.SANCTIONED_ON ? d.linkTypes.SANCTIONED_ON : 0) 
        - (d.linkTypes.HAS_KNOWN_LOCATION ? d.linkTypes.HAS_KNOWN_LOCATION : 0) 
        - d.weight, 0);
}

export function addRowColumn(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i].push({state: NONEXISTENT, data: null});
    }

    matrix.push(new Array(matrix.length + 1));
    for (let i = 0; i < matrix.length; i++) {
        matrix[matrix.length - 1][i] = {state: NONEXISTENT, data: null};
    }

    return matrix;
}

export function removeColumn(matrix, index) {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i].splice(index, 1);
    }

    matrix.splice(index, 1);
}

// =================
// D3 UTILS
// =================

export function isLeftClick() {
    return (d3.event && d3.event.which === 1)
        || (d3.event.sourceEvent && d3.event.sourceEvent.which === 1);
}

export function isRightClick() {
    return (d3.event && (d3.event.which === 3 || d3.event.button === 2))
        || (d3.event.sourceEvent && (d3.event.sourceEvent.which === 3 || d3.event.sourceEvent.button === 2));
}

export function modifierPressed() {
    const e = getD3Event();
    return e && (e.shiftKey || e.ctrlKey || e.metaKey);
}

export function getXYFromTranslate(translateString) {
    const currentTransform = d3.transform(translateString);
    const currentX = currentTransform.translate[0];
    const currentY = currentTransform.translate[1];
    return [currentX, currentY];
};

export function getScaleFromZoom(zoomString) {
    const currentTransform = d3.transform(zoomString);
    const currentX = currentTransform.scale[0];
    const currentY = currentTransform.scale[1];
    return [currentX, currentY];
};

export function createSVGImage(targetSVG, x1, x2, y1, y2, width = null, height = null) {
    const svgString = createSVGString(targetSVG, x1, x2, y1, y2, width, height);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    return url;
}

export function createSVGString(targetSVG, x1, x2, y1, y2, width = null, height = null) {
    let svgClone = targetSVG.cloneNode(true);
    if (!width) { width = Math.abs(x2 - x1); }
    if (!height) { height = Math.abs(y2 - y1); }

    svgClone.setAttribute('viewBox', `${x1} ${y1} ${width} ${height}`);

    Array.from(svgClone.childNodes).forEach((e) => {
        if (e.classList[0] !== "graph-items") {
            svgClone.removeChild(e);
        }

        Array.from(e.childNodes).forEach((e) => {
            if (e.classList[0] === "svg-grid" || e.classList.contains("icon")) {
                e.parentNode.removeChild(e);
            }
            
            // Array.from(e.childNodes).forEach((e) => {
            //     Array.from(e.childNodes).forEach((e) => {
            //         if (e.classList[0] === "icon") {
            //             e.parentNode.removeChild(e);
            //         }
            //     });
            // });
        });
    });

    const sheets = document.styleSheets;
    let styleStr = '';
    Array.prototype.forEach.call(sheets, function (sheet) {
        try { // we need a try-catch block for external stylesheets that could be there...
            if (sheet.cssRules) {
                styleStr += Array.prototype.reduce.call(sheet.cssRules, function (a, b) {
                    return a + b.cssText; // just concatenate all our cssRules' text
                }, "");
            }
        } catch (e) {
            // console.info("css stylesheet doesn't exist");
        }
    });

    // Create our svg nodes that will hold all these rules
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    style.innerHTML = styleStr;
    defs.appendChild(style);
    svgClone.insertBefore(defs, svgClone.firstElementChild);

    const svgString = new XMLSerializer().serializeToString(svgClone);
    return svgString;
}

export function getData(selection) {
    return selection[0].map(x => x.__data__);
}

// =================
// DEBUGGING METHODS
// =================

// Use for reminders and messages to come back to
console.todo = function(msg) {
    console.log(' % c % s % s % s', 'color: yellow; background - color: black;', '–', msg, '–');
}
 
// Use for important console messages
console.important = function(msg) {
    console.log(' % c % s % s % s', 'color: brown; font - weight: bold; text - decoration: underline;', '–', msg, '–');
}

// Sleep for duration ms
export function sleep(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
}

export function isObject(input) {
    return input !== null && typeof input === 'object';
}

export function printObject(object) {
    console.log(JSON.stringify(object, null, 4));
}

// ==============
// HELPER METHODS
// ==============

export function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

// Get entry from list of dictionaries by id attr
export function findEntryById(dictList, id) {
    for (let i = 0; i < dictList.length; i++) {
        if (dictList[i].id === id) return dictList[i];
    }

    return null;
}

// Wrapper to get d3 event without worrying about event vs sourceEvent
export function getD3Event() {
    if (d3.event) {
        return d3.event.sourceEvent ? d3.event.sourceEvent : d3.event;
    }

    console.error('Attempted to access nonexistent d3 event.');
    return null;
}

// Execute callback after transition has completed for EVERY element in a selection
export function then(transition, callback) {
    if (typeof callback !== "function") throw new Error("Invalid callback in then");
    if (transition.size() === 0) { callback(); }
    let n = 0;
    transition
        .each(function () { ++n; })
        .each("end", function () { if (!--n) callback.apply(this, arguments); });
}

// ==================
// MATH OPTIMIZATIONS
// ==================

// Fast arctan approximation
export function atan2(y, x) {
    const a = Math.min(Math.abs(x), Math.abs(y)) / Math.max(Math.abs(x), Math.abs(y));
    const s = a * a;
    let r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
    if (Math.abs(y) > Math.abs(x)) { r = 1.57079637 - r; }
    if (x < 0) { r = Math.PI - r; }
    return ((y < 0) ? -r : r) * 180 / Math.PI;
}

// Non-secure hash function
export function hash(str) {
    let char, hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}
