import * as d3 from 'd3';
import { 
  NONEXISTENT, 
  DISPLAYED, 
  HIDDEN, 
  GROUP_MEMBER,
  BELONGS_TO
} from './matrixConstants.js';

import { 
  ENTITY, 
  GROUP,
  GROUP_HULL
} from './constants.js';

export function isMorePreferredState(val1, val2) {
  if (val1 === GROUP_MEMBER) { return false; }
  else if (val2 === GROUP_MEMBER) { return false;}
  else if (val1 === BELONGS_TO) { return true; }
  else if (val2 === BELONGS_TO) { return false; }
  else if (val1 === DISPLAYED) { return true; }
  else if (val2 === DISPLAYED) { return false; }
  else if (val1 === HIDDEN) { return true; }
}

export function isVisibleNode(val) {
  return (val === DISPLAYED);
}

export function isGroup(d) {
  return (d.type === GROUP || d.type === GROUP_HULL);
}

export function isExpandable(d) {  
  let links = d.totalLinks;
  if (d.totalLinks && d.linkTypes) {
    links = d.linkTypes.AKA ? links - d.linkTypes.AKA : links;
    links = d.linkTypes.HAS_ID_DOC ? links - d.linkTypes.HAS_ID_DOC : links;
    links = d.linkTypes.SANCTIONED_ON ? links - d.linkTypes.SANCTIONED_ON : links;
  }
  return (links > d.weight);
}

export function addRowColumn(matrix) {
  for(var i = 0 ; i < matrix.length ; i++) {
    matrix[i].push({state: NONEXISTENT, data: null});
  }
  
  matrix.push(new Array(matrix.length + 1));
  for(var i = 0; i < matrix.length; i++) {
    matrix[matrix.length - 1][i] = {state: NONEXISTENT, data: null};
  }
  return matrix
}

export function removeColumn(matrix, index) {
  for(var i = 0 ; i < matrix.length ; i++)
  {
     matrix[i].splice(index, 1);
  }
  matrix.splice(index, 1);
}
// =================
// D3 UTILS
// =================

export function isRightClick() {
  return (d3.event && (d3.event.which == 3 || d3.event.button == 2))
    || (d3.event.sourceEvent && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2));
}

export function getXYFromTranslate(translateString) {
  var currentTransform = d3.transform(translateString);
  var currentX = currentTransform.translate[0];
  var currentY = currentTransform.translate[1];
  return [currentX, currentY];
};

export function getScaleFromZoom(zoomString) {
  var currentTransform = d3.transform(zoomString);
  var currentX = currentTransform.scale[0];
  var currentY = currentTransform.scale[1];
  return [currentX, currentY];
};

export function createSVGImage(targetSVG, x1, x2, y1, y2, width=null, height=null) {  
  const svgString = createSVGString(targetSVG, x1, x2, y1, y2, width, height);
  const blob = new Blob([ svgString ], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return url;
}

export function createSVGString(targetSVG, x1, x2, y1, y2, width=null, height=null){
  var svgClone = targetSVG.cloneNode(true);
  
  if (!width) { width = x2 - x1; }
  if (!height) { height = y2 - y1; }
  svgClone.setAttribute('viewBox', `${x1} ${y1} ${width} ${height}`);

  Array.from(svgClone.childNodes).map((e) => {
    if (e.classList[0] !== "graphItems") { svgClone.removeChild(e); }
    Array.from(e.childNodes).map((e) => {
        if (e.classList[0] === "svggrid") { e.parentNode.removeChild(e); }
    });
  });

  const sheets = document.styleSheets;
  var styleStr = '';
  Array.prototype.forEach.call(sheets, function(sheet) {
    try { // we need a try-catch block for external stylesheets that could be there...
      if (sheet.cssRules) {
        styleStr += Array.prototype.reduce.call(sheet.cssRules, function(a, b){
          return a + b.cssText; // just concatenate all our cssRules' text
        }, "");       
      }
    }
    catch(e) { console.log(e); }
  });
  // create our svg nodes that will hold all these rules
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.innerHTML = styleStr;
  defs.appendChild(style);
  svgClone.insertBefore(defs, svgClone.firstElementChild);
  
  const svgString = new XMLSerializer().serializeToString(svgClone);
  return svgString;
}

// =================
// DEBUGGING METHODS
// =================

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

// Normalize node text to same casing conventions and length
// printFull states - 0: abbrev, 1: none, 2: full
export function processNodeName(str, printFull) {
  if (!str) { return 'Document'; } 
  if (printFull == 1) { return ''; }

  const delims = [' ', '.', '('];
  for (let i = 0; i < delims.length; i++) {
    str = splitAndCapitalize(str, delims[i]);
  }

  return str;
}

export function splitAndCapitalize(str, splitChar) {
  let tokens = str.toString().split(splitChar);
  tokens = tokens.map(function (token, idx) {
    return capitalize(token, splitChar == ' ');
  });

  return tokens.join(splitChar);
}

export function capitalize(str, first) {
  return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
}

// Wrapper to get d3 event without worrying about event vs sourceEvent
export function getD3Event() {
  if (d3.event) {
    return d3.event.sourceEvent ? d3.event.sourceEvent : d3.event;
  }

  console.error('Attempted to access nonexistant d3 event.')
  return null;
}

// Execute callback after transition has completed for EVERY element in a selection
export function then(transition, callback) {
  if (typeof callback !== "function") throw new Error("Invalid callback in then");
  if (transition.size() === 0) { callback(); }
  var n = 0; 
  transition 
    .each(function() { ++n; }) 
    .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
}