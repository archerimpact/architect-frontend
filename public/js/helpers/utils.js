// =================
// DEBUGGING METHODS
// =================

// Sleep for duration ms
function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function isObject(input) {
  return input !== null && typeof input === 'object';
}

function printObject(object) {
  console.log(JSON.stringify(object, null, 4));
}

// ==============
// HELPER METHODS
// ==============

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}
// Normalize node text to same casing conventions and length
// printFull states - 0: abbrev, 1: none, 2: full
function processNodeName(str, printFull) {
  if (!str) { return 'Document'; } 
  if (printFull == 1) { return ''; }

  const delims = [' ', '.', '('];
  for (let i = 0; i < delims.length; i++) {
    str = splitAndCapitalize(str, delims[i]);
  }

  return str;
}

function splitAndCapitalize(str, splitChar) {
  let tokens = str.toString().split(splitChar);
  tokens = tokens.map(function (token, idx) {
    return capitalize(token, splitChar == ' ');
  });

  return tokens.join(splitChar);
}

function capitalize(str, first) {
  return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
}
