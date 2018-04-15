// Constants
const maxHeight = 100000;

// Populate graph usage section
function displayGraphUsage() {
  displaySidebarSection('Graph usage', 'sidebar-title', populateGraphUsageBody);
}

function populateGraphUsageBody(graphUsageBody) {
  $(graphUsageBody).append(createGraphUsageEntry('select nodes', 'r-click', '+', 'drag'));
  $(graphUsageBody).append(createGraphUsageEntry('(un)select node', 'r-click'));
  $(graphUsageBody).append(createGraphUsageEntry('(un)pin node', 'l-click'));
  $(graphUsageBody).append(createGraphUsageEntry('pan canvas', 'l-click', '+', 'drag'));
  $(graphUsageBody).append(createGraphUsageEntry('zoom in/out', 'scroll'));
  $(graphUsageBody).append(createGraphUsageEntry('unpin selected nodes', 'U'));
  $(graphUsageBody).append(createGraphUsageEntry('link new node to selected nodes', 'A'));
  $(graphUsageBody).append(createGraphUsageEntry('remove selected nodes', 'R', 'or', 'del'));
  $(graphUsageBody).append(createGraphUsageEntry('remove selected links', 'E'));  
  $(graphUsageBody).append(createGraphUsageEntry('group selected nodes', 'G'));
  $(graphUsageBody).append(createGraphUsageEntry('ungroup selected nodes', 'H'));
  $(graphUsageBody).append(createGraphUsageEntry('toggle grouped nodes view', 'dbl-click')); 
  $(graphUsageBody).append(createGraphUsageEntry('toggle document nodes', 'D')); 
  $(graphUsageBody).append(createGraphUsageEntry('toggle text length', 'P'));  
  $(graphUsageBody).append(createGraphUsageEntry('toggle stickiness of all nodes', 'F'));
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
function displayNodeInfo(info) {
  displaySidebarSection('Node info', 'sidebar-title', populateNodeInfoBody, info);
}

function populateNodeInfoBody(nodeInfoBody, info) {
  for (let key in info) {
    $(nodeInfoBody).append(createInfoTextEntry(key, info[key]));
  }
}

// Populate link info section 
function displayLinkInfo(info) {
  displaySidebarSection('Link info', 'sidebar-title', populateLinkInfoBody, info);
}

function populateLinkInfoBody(linkInfoBody, info) {
  let attr, appendTarget;
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
}

// Populate group info section
function displayGroupInfo(groups) {
  displaySidebarSection('Group info', 'sidebar-title', populateGroupInfoBody, groups);
  for (let groupId in groups) {
    displayGroupEntry(groupId, groups[groupId]);
  }
}

function populateGroupInfoBody(groupInfoBody, groups) {
  let groupEntry;
  for (let groupId in groups) {
    groupEntry = document.createElement('div');
    groupEntry.id = `group${groupId}`;
    $(groupEntry).css('overflow', 'hidden');
    $(groupInfoBody).append(groupEntry);
  }
}

function displayGroupEntry(groupId, groupData) {
  displaySidebarSection(`Group ${-1 * groupId}`, 'sidebar-subtitle', populateGroupEntry, groupData);
}

function populateGroupEntry(groupEntryBody, groupData) {
  const attributeList = ['name', 'type'];
  let groupElement, groupEntry, leftText, rightText, attr;
  for (let id in groupData.nodes) {
    groupElement = createDivElement('entity');
    for (let i = 0; i < attributeList.length; i++) {
      attr = attributeList[i];
      groupEntry = createDivElement('entity-entry');
      leftText = createDivElement('sidebar-left');
      $(leftText).append(createTextElement('sidebar-text', attr));
      rightText = createDivElement('sidebar-right');
      $(rightText).append(createTextElement('sidebar-text', groupData.nodes[id][attr]));
      $(groupEntry).append(leftText);
      $(groupEntry).append(rightText);
      $(groupElement).append(groupEntry);
    }
    
    $(groupEntryBody).append(groupElement);
  }
}

// General element creation & helper methods
function displaySidebarSection(titleText, titleClass, populateBody) {
  const targetId = deriveTargetIdFromTitleText(titleText);
  $(`#${targetId}`).html('');

  const sectionTitle = createTitleElement(titleClass, titleText);
  sectionTitle.id = `${targetId}-title`;
  const titleId = `#${sectionTitle.id}`;

  const sectionBody = document.createElement('div');
  sectionBody.id = `${targetId}-body`; 
  const bodyId = `#${sectionBody.id}`;

  sectionTitle.onclick = () => {
    $(bodyId).css('max-height',  $(titleId).hasClass('open') ? 0 : maxHeight);
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

  const icon = document.createElement('i');
  icon.className = 'fa fa-chevron-up';
  $(titleElement).append(icon);

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

function deriveTargetIdFromTitleText(titleText) {
  // Ex: 'Graph usage' --> 'graph-usage'
  return titleText.split(' ').join('-').toLowerCase();
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

// Color info icon onclick
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

    // alt+i: Open sidebar
    if (altDown && e.which == 73) {
      openSidebar();
    }

    // esc/enter: Close sidebar
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