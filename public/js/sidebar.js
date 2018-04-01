// Populate graph usage section
function appendGraphUsageEntry(key) {
  const leftText = createDivElement('sidebar-left');
  $(leftText).append(createTextElement('sidebar-text', key));

  const rightText = createDivElement('sidebar-right');
  let text = false;
  for (let arg of Array.prototype.slice.call(arguments, 1)) {
    const element = text ? createTextElement('sidebar-text', `&nbsp;${arg}&nbsp;`) : createTextElement('sidebar-code', arg);
    $(rightText).append(element);
    text = !text;
  }

  const contentEntry = createDivElement('content-entry');
  $(contentEntry).append(leftText);
  $(contentEntry).append(rightText);
  $('#graph-usage').append(contentEntry);
}

// Populate node info section
function createInfoTextEntry(key, value) {
  const leftText = createDivElement('sidebar-left');
  $(leftText).append(createTextElement('sidebar-text', key));
  const rightText = createDivElement('sidebar-right');
  $(rightText).append(createTextElement('sidebar-text', value));
  const contentEntry = createDivElement('content-entry');
  $(contentEntry).append(leftText);
  $(contentEntry).append(rightText);
  return contentEntry;
}

function createInfoObjectEntry(key, object, attrs) {
  const entries = [];
  if (attrs) {
    for (let i = 0; i < attrs.length; i++) {
      entries.push(createInfoTextEntry(`${key} ${attrs[i]}`, object[attrs[i]]));
    }
  } else {
    for (let objectKey in object) {
      entries.push(createInfoTextEntry(`${key} ${objectKey}`, object[objectKey]));
    }
  }

  return entries;
}

function displayNodeInfo(info) {
  clearNodeInfo();
  $('#node-info').append(createTitleElement('sidebar-title', 'Node info'));
  for (let key in info) {
    $('#node-info').append(createInfoTextEntry(key, info[key]));
  }
}

function clearNodeInfo() {
  $('#node-info').html('');
}

// Populate link info section 
function displayLinkInfo(info) {
  clearLinkInfo();
  $('#link-info').append(createTitleElement('sidebar-title', 'Link info'));

  let attr, appendTarget;
  for (let key in info) {
    attr = info[key];
    if (attr !== null && typeof attr === 'object') {
      appendTarget = createInfoObjectEntry(key, attr, ['name', 'type'])
      for (let i = 0; i < appendTarget.length; i++) {
        $('#link-info').append(appendTarget[i]);
      }
    } else {
      $('#link-info').append(createInfoTextEntry(key, info[key]));
    }
  }
}

function clearLinkInfo() {
  $('#link-info').html('');
}

// Populate group info section
function appendGroupEntry(key, val) {
  $('#group-info').append(createTitleElement('sidebar-subtitle', `Group ${-1 * key}`)); 
  $("#group-info").append('<button onclick = "toggleGroupView(' + key + ')""> Toggle Group View</button>')
  const attributeList = ['name', 'type'];
  let groupElement, groupEntry, leftText, rightText, attr;
  for (let id in val.nodes) {
    groupElement = createDivElement('entity');
    for (let i = 0; i < attributeList.length; i++) {
      attr = attributeList[i];
      groupEntry = createDivElement('entity-entry');
      leftText = createDivElement('sidebar-left');
      $(leftText).append(createTextElement('sidebar-text', attr.charAt(0).toUpperCase() + attr.slice(1)));
      rightText = createDivElement('sidebar-right');
      $(rightText).append(createTextElement('sidebar-text', val.nodes[id][attr]));
      $(groupEntry).append(leftText);
      $(groupEntry).append(rightText);
      $(groupElement).append(groupEntry);
    }
    $("#group-info").append(groupElement);
  }
}

function displayGroupInfo(groups) {
  clearGroupInfo();
  $('#group-info').append(createTitleElement('sidebar-title', 'Group info'));
  for (let group_id in groups) {
    appendGroupEntry(group_id, groups[group_id]);
  }
}

function clearGroupInfo () {
  $('#group-info').html('');
}

// General element creation
function createTextElement(className, text) {
  const textElement = createDivElement(className);
  textElement.innerHTML = text;
  return textElement;
}

function createTitleElement(className, title) {
  const titleElement = createDivElement(className);
  const titleText = document.createElement('p');
  titleText.innerHTML = title;
  $(titleElement).append(titleText);
  return titleElement;
}

function createDivElement(className) {
  const divElement = document.createElement('div');
  divElement.className = className;
  return divElement;
}

// Toggle sidebar
function openSidebar() {
  $("#sidebar-content-area").css("margin-right", '20px');
  $("#sidebar").width(300);
}

function closeSidebar() {
  $("#sidebar").width(0);
  $("#sidebar-content-area").css("margin-right", 0);
  $("#transparent-navbar i").removeClass("blue");
}

$("#transparent-navbar i").click(function() {
  $(this).toggleClass("blue");
});

// Content population & keycodes
$(document).ready(function() {
  appendGraphUsageEntry('select nodes', 'r-click', '+', 'drag');
  appendGraphUsageEntry('(un)select node', 'r-click');
  appendGraphUsageEntry('(un)pin node', 'l-click');
  appendGraphUsageEntry('move canvas', 'l-click', '+', 'drag');
  appendGraphUsageEntry('zoom in/out', 'scroll');
  appendGraphUsageEntry('unpin selected nodes', 'U');
  appendGraphUsageEntry('add node to selected', 'A');
  appendGraphUsageEntry('remove selected nodes', 'R', 'or', 'del');
  appendGraphUsageEntry('group selected nodes', 'G');
  appendGraphUsageEntry('ungroup selected nodes', 'H');
  appendGraphUsageEntry('toggle view of document nodes', 'D');  

  let altDown = false;
  $(document).keydown(function(e) {
    // Listen for alt/command press
    if (e.which == 18 || e.which == 91) {
      altDown = true;
    }

    // Quick search with alt+s
    if (altDown && e.which == 83) {
      quickSearch();
    }

    // Open sidebar with alt+i
    if (altDown && e.which == 73) {
      openSidebar();
    }

    // Close sidebar with esc/enter
    else if (e.which == 27 || e.which == 13) {
      closeSidebar();
    }
  });

  $(document).keyup(function(e) {
    // Listen for alt/command press end
    if (e.keyCode == 18 || e.keyCode == 91) {
      altDown = false;
    }
  });
});