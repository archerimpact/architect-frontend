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