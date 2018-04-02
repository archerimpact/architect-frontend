// Populate graph usage section
let isGraphUsageHidden = false;
function displayGraphUsage() {
  const graphUsageTitle = createTitleElement('sidebar-title', 'Graph usage');
  graphUsageTitle.id = 'graph-usage-title';
  graphUsageTitle.onclick = () => {
    if (isGraphUsageHidden) {
      $('#graph-usage-title').addClass('open');
      $('#graph-usage-body').css('max-height', 500);
    } else { 
      $('#graph-usage-title').removeClass('open');
      $('#graph-usage-body').css('max-height', 0);
    }

    isGraphUsageHidden = !isGraphUsageHidden;
  }

  const graphUsageBody = document.createElement('div');
  graphUsageBody.id = 'graph-usage-body'; 
  $(graphUsageBody).append(createGraphUsageEntry('select nodes', 'r-click', '+', 'drag'));
  $(graphUsageBody).append(createGraphUsageEntry('(un)select node', 'r-click'));
  $(graphUsageBody).append(createGraphUsageEntry('(un)pin node', 'l-click'));
  $(graphUsageBody).append(createGraphUsageEntry('move canvas', 'l-click', '+', 'drag'));
  $(graphUsageBody).append(createGraphUsageEntry('zoom in/out', 'scroll'));
  $(graphUsageBody).append(createGraphUsageEntry('unpin selected nodes', 'U'));
  $(graphUsageBody).append(createGraphUsageEntry('add node to selected', 'A'));
  $(graphUsageBody).append(createGraphUsageEntry('remove selected nodes', 'R', 'or', 'del'));
  $(graphUsageBody).append(createGraphUsageEntry('group selected nodes', 'G'));
  $(graphUsageBody).append(createGraphUsageEntry('ungroup selected nodes', 'H'));
  $(graphUsageBody).append(createGraphUsageEntry('toggle view of document nodes', 'D')); 
  $(graphUsageBody).append(createGraphUsageEntry('toggle node text abbreviation', 'P'));  

  $('#graph-usage').append(graphUsageTitle);
  $('#graph-usage').append(graphUsageBody);
}

function createGraphUsageEntry(key) {
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
  return contentEntry;
}

// Populate node info section
let isNodeInfoHidden = false;
function displayNodeInfo(info) {
  clearNodeInfo();

  const nodeInfoTitle = createTitleElement('sidebar-title', 'Node info');
  nodeInfoTitle.id = 'node-info-title';
  nodeInfoTitle.onclick = () => {
    if (isNodeInfoHidden) {
      $('#node-info-title').addClass('open');
      $('#node-info-body').css('max-height', 500);
    } else { 
      $('#node-info-title').removeClass('open');
      $('#node-info-body').css('max-height', 0);
    }

    isNodeInfoHidden = !isNodeInfoHidden;
  }

  const nodeInfoBody = document.createElement('div');
  nodeInfoBody.id = 'node-info-body';
  for (let key in info) {
    $(nodeInfoBody).append(createInfoTextEntry(key, info[key]));
  }

  $('#node-info').append(nodeInfoTitle);
  $('#node-info').append(nodeInfoBody);
}

function clearNodeInfo() {
  isNodeInfoHidden = false;
  $('#node-info').html('');
}

// Populate link info section 
let isLinkBodyHidden = false;
function displayLinkInfo(info) {
  clearLinkInfo();
  const linkInfoTitle = createTitleElement('sidebar-title', 'Link info');
  linkInfoTitle.id = 'link-info-title';
  linkInfoTitle.onclick = () => {
    if (isLinkBodyHidden) {
      $('#link-info-title').addClass('open');
      $('#link-info-body').css('max-height', 250);
    } else { 
      $('#link-info-title').removeClass('open');
      $('#link-info-body').css('max-height', 0);
    }

    isLinkBodyHidden = !isLinkBodyHidden;
  }

  let attr, appendTarget;
  const linkInfoBody = document.createElement('div');
  linkInfoBody.id = 'link-info-body';
  for (let key in info) {
    attr = info[key];
    if (isObject(attr)) {
      appendTarget = createInfoObjectEntry(key, attr, ['name', 'type'])
      for (let i = 0; i < appendTarget.length; i++) {
        $(linkInfoBody).append(appendTarget[i]);
      }
    } else {
      $(linkInfoBody).append(createInfoTextEntry(key, info[key]));
    }
  }

  $('#link-info').append(linkInfoTitle);
  $('#link-info').append(linkInfoBody);
}

function clearLinkInfo() {
  isLinkBodyHidden = false;
  $('#link-info').html('');
}

// Populate group info section
let isGroupInfoHidden = false;
function displayGroupInfo(groups) {
  clearGroupInfo();
  const groupInfoTitle = createTitleElement('sidebar-title', 'Group info');
  groupInfoTitle.id = 'group-info-title';
  groupInfoTitle.onclick = () => {
    if (isGroupInfoHidden) {
      $('#group-info-title').addClass('open');
      $('#group-info-body').css('max-height', 5000);
    } else { 
      $('#group-info-title').removeClass('open');
      $('#group-info-body').css('max-height', 0);
    }

    isGroupInfoHidden = !isGroupInfoHidden;
  }

  const groupInfoBody = document.createElement('div');
  groupInfoBody.id = 'group-info-body';
  for (let group_id in groups) {
    $(groupInfoBody).append(createGroupEntry(group_id, groups[group_id]));
  }

  $('#group-info').append(groupInfoTitle);
  $('#group-info').append(groupInfoBody);
}

function createGroupEntry(key, val) {
  const retElement = document.createElement('div');
  $(retElement).append(createTitleElement('sidebar-subtitle', `Group ${-1 * key}`)); 
  $(retElement).append('<button onclick = "toggleGroupView(' + key + ')""> Toggle view</button>')
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
    
    $(retElement).append(groupElement);
  }

  return retElement;
}

function clearGroupInfo () {
  isGroupInfoHidden = false;
  $('#group-info').html('');
}

// General element creation
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

function createTitleElement(className, title) {
  const titleElement = createDivElement(className + ' open');
  const titleText = document.createElement('p');
  titleText.className = 'unselectable';
  titleText.innerHTML = title;
  $(titleElement).append(titleText);

  if (className == 'sidebar-title') {
    const icon = document.createElement('i');
    icon.className = 'fa fa-chevron-up';
    $(titleElement).append(icon);
  }

  return titleElement;
}

function createTextElement(className, text) {
  const textElement = createDivElement(className);
  textElement.innerHTML = text;
  return textElement;
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
  displayGraphUsage();

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