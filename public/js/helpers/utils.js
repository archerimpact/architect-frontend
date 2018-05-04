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
} from './typeConstants.js';

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