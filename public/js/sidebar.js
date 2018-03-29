// Populate graph usage section
function appendGraphUsageEntry(key) {
  const leftText = document.createElement('div');
  leftText.className = 'sidebar-left';
  $(leftText).append(createDivElement('sidebar-text', key));

  const rightText = document.createElement('div')
  rightText.className = 'sidebar-right';
  let text = false;
  for (let arg of Array.prototype.slice.call(arguments, 1)) {
    const element = text ? createDivElement('sidebar-text', `&nbsp;${arg}&nbsp;`) : createDivElement('sidebar-code', arg);
    $(rightText).append(element);
    text = !text;
  }

  const contentEntry = document.createElement('div');
  contentEntry.className = 'content-entry';
  $(contentEntry).append(leftText);
  $(contentEntry).append(rightText);
  $('#graph-usage').append(contentEntry);
}

// Populate node info section
function createNodeInfoEntry(key, value) {
  const leftText = document.createElement('div');
  leftText.className = 'sidebar-left';
  $(leftText).append(createDivElement('sidebar-text', key));

  const rightText = document.createElement('div')
  rightText.className = 'sidebar-right';
  $(rightText).append(createDivElement('sidebar-text', value));

  const contentEntry = document.createElement('div');
  contentEntry.className = 'content-entry';
  $(contentEntry).append(leftText);
  $(contentEntry).append(rightText);
  return contentEntry;
}

function displayNodeInfo(info) {
  clearNodeInfo();
  const titleElement = createTitleElement('Node info');
  $('#node-info').append(titleElement);
  for (key in info) {
    const contentEntry = createNodeInfoEntry(key, info[key]);
    $('#node-info').append(contentEntry);
  }
}

function clearNodeInfo() {
  $('#node-info').html('');
}

// General element creation
function createDivElement(className, text) {
  const textElement = document.createElement('div');
  textElement.className = className;
  textElement.innerHTML = text;
  return textElement;
}

function createTitleElement(title) {
  const titleElement = document.createElement('div');
  titleElement.className = 'sidebar-title';

  const titleText = document.createElement('p');
  titleElement.innerHTML = title;

  $(titleElement).append(titleText);
  return titleElement;
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

// Alice content append
$('#sidebar-group-info').on('contentchanged', function() {
  const keys = Object.keys(groups)
  $('#sidebar-group-info').html('<div></div>')
  keys.map((key)=> {
    $('#sidebar-group-info').append('<div class="group" id=group' + -1*key +'> group ' + -1*key + '</div>')
    groups[key].map((node) => {
      $('#group' + -1*key).append('<div class="group-entry" id=node' + node.id +'> Name: ' + node.name + ', Type: ' + node.type + '</div><hr></hr>')
    })
  })
})

// Content population & keycodes
$(document).ready(function() {
  appendGraphUsageEntry('select nodes', 'r-click', '+', 'drag');
  appendGraphUsageEntry('(un)select node', 'r-click');
  appendGraphUsageEntry('(un)pin node', 'l-click');
  appendGraphUsageEntry('unpin selected nodes', 'U');
  appendGraphUsageEntry('group selected nodes', 'G');
  appendGraphUsageEntry('remove selected nodes', 'R', 'or', 'del');

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