function appendContentEntry(key) {
  var leftText = document.createElement('div');
  leftText.className = 'sidebar-left';
  $(leftText).append(createDivElement('sidebar-text', key));

  var rightText = document.createElement('div')
  rightText.className = 'sidebar-right';
  let text = false;
  for (let arg of Array.prototype.slice.call(arguments, 1)) {
    var element = text ? createDivElement('sidebar-text', arg) : createDivElement('sidebar-code', arg);
    $(rightText).append(element);
    text = !text;
  }

  var contentEntry = document.createElement('div');
  contentEntry.className = 'content-entry';
  $(contentEntry).append(leftText);
  $(contentEntry).append(rightText);
  $('#sidebar-content-area').append(contentEntry);
}

function createDivElement(className, text) {
  var textElement = document.createElement('div');
  textElement.className = className;
  textElement.innerHTML = text;
  return textElement;
}

function openSidebar() {
  $("#sidebar-content-area").css("margin-right", '20px');
  $("#sidebar").width(300);
}

function closeSidebar() {
  $("#sidebar").width(0);
  $("#sidebar-content-area").css("margin-right", 0);
  $("#transparent-navbar i").removeClass("blue");
}

function quickSearch() {
  $("#search-bar").select();
}

function navigate(link) {
  window.location.href = `/${link}`;
}

$("#transparent-navbar i").click(function() {
  $(this).toggleClass("blue");
});

$('#sidebar-group-info').on('contentchanged', function() {
  var keys = Object.keys(groups)
  $('#sidebar-group-info').html('<div></div>')
  keys.map((key)=> {
    $('#sidebar-group-info').append('<div class="group" id=group' + -1*key +'> group ' + -1*key + '</div>')
    groups[key].nodes.map((node) => {
      $('#group' + -1*key).append('<div class="group-entry" id=node' + node.id +'> Name: ' + node.name + ', Type: ' + node.type + '</div><hr></hr>')
    })
  })
})

$(document).ready(function() {
  appendContentEntry('select nodes', 'click', '+', 'drag');
  appendContentEntry('(un)select node', 'ctrl', '+', 'click');
  appendContentEntry('(un)pin node', 'click');
  appendContentEntry('unpin selected nodes', 'U');

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