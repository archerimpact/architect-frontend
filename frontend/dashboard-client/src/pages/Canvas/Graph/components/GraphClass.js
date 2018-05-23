'use strict';

import * as d3 from 'd3';
import * as aesthetics from './helpers/aesthetics.js';
import * as utils from './helpers/utils.js';
import * as mouseClicks from './helpers/mouseClicks.js';
import * as tt from './helpers/tooltips.js';
import * as matrix from './helpers/matrix.js';
import * as d3Data from './helpers/changeD3Data.js';
import Minimap from './MinimapClass.js'
import * as constants from './helpers/constants.js';
import * as colors from './helpers/colorConstants.js';
import { GROUP, HULL_GROUP, DOCUMENT, PERSON, CORPORATION } from './helpers/constants.js';

// FontAwesome icon unicode-to-node type dict
// Use this to find codes for FA icons: https://fontawesome.com/cheatsheet
const icons = {
  [constants.PERSON]: '',
  'Individual': '',
  'Document': '',
  [constants.IDENTIFYING_DOCUMENT] : '',
  'corporation': '',
  'Entity': '',
  [constants.ORGANIZATION]: '',
  'group': '',
  'same_as_group': '',
  [constants.BUTTON_ZOOM_IN_ID]: '',
  [constants.BUTTON_ZOOM_OUT_ID]: '',
  [constants.BUTTON_POINTER_TOOL_ID]: '',
  [constants.BUTTON_SELECTION_TOOL_ID]: '',
  [constants.BUTTON_EDIT_MODE_ID]: '',
  [constants.BUTTON_FIX_NODE_ID]: '',
  [constants.BUTTON_SIMPLIFY_ID]: '',
  [constants.BUTTON_TOGGLE_MINIMAP_ID]: '',
  [constants.BUTTON_UNDO_ACTION_ID]: '',
  [constants.BUTTON_REDO_ACTION_ID]: '',
  [constants.BUTTON_SAVE_PROJECT_ID]: '' 
};

class Graph {
  constructor() {
    this.height = null;
    this.width = null;
    this.center = null;
    this.brushX = null;
    this.brushY = null;
    this.numTicks = null;

    this.menuActions = [];
    this.contextMenu = null;

    this.degreeExpanded = 0;
    this.expandingNode = null;

    this.editMode = false; // Keep track of edit mode (add/remove/modify nodes + links)
    this.dragLink = null; // Dynamic link from selected node in edit mode
    this.dragCallback = null; // Store reference to drag callback to restore after disabling node drag
    this.dragDistance = 0; // Keep track of drag distance starting on node to disable click during edit mode
    this.mousedownNode = null; // Store reference to current node on mousedown (aka currently edited node)
    this.recentActions = []; // Stack storing most recent actions by user, each entry takes the form [actionName, data]

    this.minimap = null;
    this.tickCount = 0;
    this.xbound = [0, 0];
    this.ybound = [0, 0];

    this.isDragging = false; // Keep track of dragging to disallow node emphasis on drag
    this.draggedNode = null; // Store reference to currently dragged node, null otherwise
    this.isBrushing = false;
    this.isEmphasized = false; // Keep track of node emphasis to end node emphasis on drag
    this.typesShown = { 'Document' : true, 'person' : true, 'corporation' : true };
    this.hoveredNode = null; // Store reference to currently hovered/emphasized node, null otherwise
    this.deletingHoveredNode = false; // Store whether you are deleting a hovered node, if so you reset graph opacity
    this.printFull = 0; // Allow user to toggle node text length
    this.isGraphFixed = false; // Track whether or not all nodes should be fixed
    this.isZooming = false; // Track if graph is actively being transformed
    this.zoomTranslate = [0, 0]; // Keep track of original zoom state to restore after right-drag
    this.zoomScale = 1;
    this.zoomPressed = null;
    this.debug = false; // Show all node/link attributes in tooltip, coordinate box

    this.node = null;
    this.link = null;
    this.hull = null;
    this.nodes = [];
    this.links = [];
    this.hulls = [];
    this.nodeEnter = null;
    this.zoom = null;
    this.brush = null;
    this.svg = null;
    this.svgBrush = null;
    this.container = null;
    this.curve = null;
    this.svgGrid = null;
    this.force = null;
    this.drag = null;

    this.adjacencyMatrix = new Array();
    this.globalLinks = {};
    this.globalNodes = [];

    this.ticked = this.ticked.bind(this);
    this.brushstart = this.brushstart.bind(this);
    this.brushing = this.brushing.bind(this);
    this.brushend = this.brushend.bind(this);
    this.clicked = this.clicked.bind(this);
    this.rightclicked = this.rightclicked.bind(this);
    this.dblclicked = this.dblclicked.bind(this);
    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.clickedCanvas = this.clickedCanvas.bind(this);
    this.dragstartCanvas = this.dragstartCanvas.bind(this);
    this.mouseupCanvas = this.mouseupCanvas.bind(this);
    this.mousemoveCanvas = this.mousemoveCanvas.bind(this);
    this.mouseoverLink = this.mouseoverLink.bind(this);
    this.zoomstart = this.zoomstart.bind(this);
    this.zooming = this.zooming.bind(this);
    this.zoomend = this.zoomend.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.initializeZoom = this.initializeZoom.bind(this);
    this.initializeBrush = this.initializeBrush.bind(this);
    this.drawHull = this.drawHull.bind(this);
    this.zoomButton = this.zoomButton.bind(this);
    this.initializeToolbarButtons = this.initializeToolbarButtons.bind(this);
    this.getToolbarLabels = this.getToolbarLabels.bind(this);
    this.initializeZoomButtons = this.initializeZoomButtons.bind(this);
    this.initializeButton = this.initializeButton.bind(this);
    this.textWrap = this.textWrap.bind(this);
    this.displayTooltip = this.displayTooltip.bind(this);
    this.displayDebugTooltip = this.displayDebugTooltip.bind(this);
    this.populateNodeInfoBody = this.populateNodeInfoBody.bind(this);
    this.resetDragLink = this.resetDragLink.bind(this);

    this.bindDisplayFunctions({}); //no display functions yet
  }

  initializeDataDicts() {
    this.groups = {}; // Store groupNodeId --> {links: [], nodes: [], groupid: int}
    this.expandedGroups = {}; // Store groupNodeId --> expansion state
    this.hidden = { links: [], nodes: [] }; // Store all links and nodes that are hidden  
    this.nodeSelection = {}; // Store node.index --> selection state
    this.linkedById = {}; // Store each pair of neighboring nodes

    this.globallinkid = -1;
    this.globalnodeid = -1;
  }

  initializeZoom() {
    const self = this;
    const zoom = d3.behavior.zoom()
      .scaleExtent([constants.MIN_SCALE, constants.MAX_SCALE])
      .on('zoomstart', function (d) { self.zoomstart(d, this) })
      .on('zoom', function (d) { self.zooming(d, this) })
      .on('zoomend', function (d) { self.zoomend(d, this) });

    return zoom;
  }

  initializeBrush() {
    const self = this;
    return d3.svg.brush()
      .on('brushstart', function (d) { self.brushstart(d, this) })
      .on('brush', function (d) { self.brushing(d, this) })
      .on('brushend', function (d) { self.brushend(d, this) })
      .x(self.brushX).y(self.brushY);
  }

  // Create canvas
  initializeSVG() {
    const self = this;
    const svg = d3.select('#graph-container').append('svg')
      .attr('id', 'canvas')
      .attr('pointer-events', 'all')
      .classed('svg-content', true)
      .on('mouseup', function () { self.mouseupCanvas(this); })
      .call(d3.behavior.drag()
        .on('dragstart', function (d) { self.dragstartCanvas(d, this) })
      )
      .call(this.zoom);

    // Disable context menu from popping up on right click
    svg.on('contextmenu', function (d, i) {
      d3.event.preventDefault();
    });

    return svg;
  }

  // Normally we append a g element right after call(zoom), but in this case we don't
  // want panning to translate the brush off the screen (disabling all mouse events).
  initializeSVGBrush() {
    // Extent invisible on left click
    const svgBrush = this.svg.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    this.svg.on('mousedown', () => {
      svgBrush.style('opacity', utils.isRightClick() ? 1 : 0);
    });

    return svgBrush;
  }

  // We need this reference because selectAll and listener calls will refer to svg, 
  // whereas new append calls must be within the same g, in order for zoom to work.
  initializeContainer() {
    return this.svg.append('g')
      .attr('class', 'graphItems');
  }

  //set up how to draw the hulls
  initializeCurve() {
    return d3.svg.line()
      .interpolate('cardinal-closed')
      .tension(.85);
  }

  initializeSVGgrid() {
    const svgGrid = this.container.append('g')
      .attr('class', 'svggrid');
    svgGrid
      .append('g')
      .attr('class', 'x-ticks')
      .selectAll('line')
      .data(d3.range(0, (this.numTicks + 1) * constants.GRID_LENGTH, constants.GRID_LENGTH))
      .enter().append('line')
      .attr('x1', (d) => { return d; })
      .attr('y1', (d) => { return -1 * constants.GRID_LENGTH; })
      .attr('x2', (d) => { return d; })
      .attr('y2', (d) => { return (1 / constants.MIN_SCALE) * this.height + constants.GRID_LENGTH; });

    svgGrid
      .append('g')
      .attr('class', 'y-ticks')
      .selectAll('line')
      .data(d3.range(0, (this.numTicks + 1) * constants.GRID_LENGTH, constants.GRID_LENGTH))
      .enter().append('line')
      .attr('x1', (d) => { return -1 * constants.GRID_LENGTH; })
      .attr('y1', (d) => { return d; })
      .attr('x2', (d) => { return (1 / constants.MIN_SCALE) * this.width + constants.GRID_LENGTH; })
      .attr('y2', (d) => { return d; });

    return svgGrid;
  }

  initializeForce() {
    return d3.layout.force()
      .size([this.width, this.height]);
  }

  intitializeDrag() {
    const self = this;
    const drag = this.force.drag()
      .origin((d) => { return d; })
      .on('dragstart', function (d) { self.dragstart(d, this) })
      .on('drag', function (d) { self.dragging(d, this) })
      .on('dragend', function (d) { self.dragend(d, this) });

    return drag;
  }

  initializeMenuActions() {
    this.menuActions = [
      {
        title: 'Group selected nodes',
        action: (elm, d, i) => { this.groupSelectedNodes(); }
      },
      {
        title: 'Ungroup selected nodes',
        action: (elm, d, i) => { this.ungroupSelectedGroups(); }
      },
      {
        title: 'Expand 1st degree connections...',
        action: (elm, d, i) => { this.expandNodeFromData(d); }
      }

    ]
  }

  initializeContextMenu() {
    // LICENSING INFO: https://github.com/patorjk/d3-context-menu
    this.contextMenu = function (menu, openCallback) {
      // create the div element that will hold the context menu
      d3.selectAll('.context-menu')
        .data([1]).enter()
        .append('div')
        .attr('class', 'context-menu');

      // Close context menu 
      d3.select('body').on('click', () => { d3.select('.context-menu').style('display', 'none'); });

      // this gets executed when a contextmenu event occurs
      return function(data, index) {  
        const self = this;
        d3.selectAll('.context-menu').html('');
        var list = d3.selectAll('.context-menu').append('ul');
        list.selectAll('li')
          .data(menu).enter()
          .append('li')
          .html((d) => { return d.title; })
          .classed('unselectable', true)
          .on('click', function(d, i) {
            d.action(self, data, index);
            d3.select('.context-menu').style('display', 'none');
          });

        // the openCallback allows an action to fire before the menu is displayed
        // an example usage would be closing a tooltip
        if (openCallback) openCallback(data, index);

        // display context menu
        d3.select('.context-menu')
          .style('left', (d3.event.pageX - 2) + 'px')
          .style('top', (d3.event.pageY - 2) + 'px')
          .style('display', 'block');

        d3.event.preventDefault();
      };
    };
  }

  // direction-size-color
  initializeMarkers() {
    const possibleAttrs = [
      ['start', 'end'],
      ['big', 'small'],
      ['gray', 'blue']
    ];
    const markerList = this.deriveMarkerData(this.getMarkerIdPermutations(possibleAttrs));
    for (let marker of markerList) {
      this.svg.append('defs')
        .append('marker')
          .attr('id', marker.id)
          .attr('viewBox', '5 -5 10 10')
          .attr('refX', 10)
          .attr('markerWidth', marker.size)
          .attr('markerHeight', marker.size)
          .attr('orient', marker.direction)
        .append('path')
          .attr('d', 'M 0,-5 L 10,0 L 0,5')
          .style('stroke', marker.color)
          .style('fill', marker.color)
          .style('fill-opacity', 1);
    }
  }

  // possibleAttrs is a list of lists that contains the possibilities for each attr
  // This method should return a list of all possible permutations of the given attrs
  getMarkerIdPermutations(possibleAttrs) {
    if (!possibleAttrs) { return []; }
    if (possibleAttrs.length == 1) { return possibleAttrs[0]; }
    let i, j;
    const markerIds = [];
    const rest = this.getMarkerIdPermutations(possibleAttrs.slice(1));
    for (i = 0; i < rest.length; i++) {
      for (j = 0; j < possibleAttrs[0].length; j++) {
        markerIds.push(`${possibleAttrs[0][j]}-${rest[i]}`);
      }
    }

    return markerIds;
  }

  deriveMarkerData(permutationList) {
    const markerList = [];
    for (let markerId of permutationList) {
      markerList.push({ id: markerId });
    }

    const colorNameToHex = {
      'gray': colors.HEX_DARK_GRAY,
      'blue': colors.HEX_BLUE
    };

    let marker, id, tokens;
    for (marker of markerList) {
      tokens = marker.id.split('-');
      marker.direction = (tokens[0] === 'end') ? 'auto' : 'auto-start-reverse';
      marker.size = (tokens[1] === 'big') ? constants.MARKER_SIZE_BIG : constants.MARKER_SIZE_SMALL;
      marker.color = colorNameToHex[tokens[2]];
    }

    return markerList;
  }

  initializeDragLink() {
    return this.svg.append('line')
      .attr('class', 'link dynamic')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .attr('marker-end', 'url(#end-big-gray)')
      .style('visibility', 'hidden');
  }

  initializeToolbarButtons() {
    const buttonData = this.getToolbarLabels();

    this.svg.append('rect')
      .attr('y', constants.TOOLBAR_PADDING)
      .attr({ x: constants.TOOLBAR_PADDING, width: constants.BUTTON_WIDTH, height: this.height - constants.TOOLBAR_PADDING * 2 })
      .style('fill', colors.HEX_PRIMARY_ACCENT)
      .on('click', () => { d3.select('.context-menu').style('display', 'none'); });

    const button = this.svg.selectAll('.button')
      .data(buttonData)
      .enter().append('g')
      .attr('pointer-events', 'all');

    button.append('title')
      .text((d) => { return d.title; });

    button.append('text')
      .attr('class', 'button-icon')
      .attr('x', constants.TOOLBAR_PADDING + constants.BUTTON_WIDTH / 2)
      .attr('y', (d, i) => { return (constants.TOOLBAR_PADDING + constants.BUTTON_WIDTH / 2) + i * constants.BUTTON_WIDTH; })
      .style({ 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-family': 'FontAwesome', 'font-size': constants.BUTTON_WIDTH * 0.4 + 'px' })
      .style('fill', colors.HEX_WHITE)
      .style('font-weight', 'lighter')
      .text((d) => { return (d.label && icons[d.label]) ? icons[d.label] : ''; })
      .classed('unselectable', true);

    button.append('rect')
      .attr('id', (d) => { return d.label; })
      .attr('y', (d, i) => { return constants.TOOLBAR_PADDING + i * constants.BUTTON_WIDTH; })
      .attr({ x: constants.TOOLBAR_PADDING, width: constants.BUTTON_WIDTH, height: constants.BUTTON_WIDTH, class: 'button' })
      .on('dblclick', this.stopPropagation)
      .call(d3.behavior.drag()
        .on('dragstart', this.stopPropagation)
        .on('drag', this.stopPropagation)
        .on('dragend', this.stopPropagation)
      );
  }

  getToolbarLabels() {
    const labels = [constants.BUTTON_ZOOM_IN_ID, constants.BUTTON_ZOOM_OUT_ID, constants.BUTTON_POINTER_TOOL_ID,
                    constants.BUTTON_SELECTION_TOOL_ID, constants.BUTTON_EDIT_MODE_ID, constants.BUTTON_FIX_NODE_ID, 
                    constants.BUTTON_SIMPLIFY_ID, constants.BUTTON_TOGGLE_MINIMAP_ID, constants.BUTTON_UNDO_ACTION_ID, 
                    constants.BUTTON_REDO_ACTION_ID, constants.BUTTON_SAVE_PROJECT_ID];
    const titles = [constants.BUTTON_ZOOM_IN_TITLE, constants.BUTTON_ZOOM_OUT_TITLE, constants.BUTTON_POINTER_TOOL_TITLE,
                    constants.BUTTON_SELECTION_TOOL_TITLE, constants.BUTTON_EDIT_MODE_TITLE, constants.BUTTON_FIX_NODE_TITLE, 
                    constants.BUTTON_SIMPLIFY_TITLE, constants.BUTTON_TOGGLE_MINIMAP_TITLE, constants.BUTTON_UNDO_ACTION_TITLE, 
                    constants.BUTTON_REDO_ACTION_TITLE, constants.BUTTON_SAVE_PROJECT_TITLE];
    const labelObjects = [];
    for (let i = 0; i < labels.length; i++) {
      labelObjects.push({ label: labels[i], title: titles[i] });
    }

    return labelObjects;
  }

  // Control logic to zoom when buttons are pressed, keep zooming while they are pressed, stop zooming 
  // when released or moved off of, not snap-pan when moving off buttons, and restore pan on mouseup.
  initializeZoomButtons() {
    const self = this;
    this.zoomPressed = false;
    d3.selectAll(`#${constants.BUTTON_ZOOM_IN_ID}, #${constants.BUTTON_ZOOM_OUT_ID}`)
      .on('mousedown', function() {
        self.zoomPressed = true;
        self.disableZoom();
        self.zoomButton(this.id === constants.BUTTON_ZOOM_IN_ID);
        d3.select('.context-menu').style('display', 'none');
      })
      .on('mouseup', () => { this.zoomPressed = false; })
      .on('mouseout', () => { this.zoomPressed = false; });

    this.svg.on('mouseup', () => { this.svg.call(this.zoom) });
  }

  initializeButton(id, onclick, isSelected=false) {
    d3.select('#' + id)
      .on('click', () => { 
        onclick();
        d3.select('.context-menu').style('display', 'none');
        this.stopPropagation(); 
      })
      .classed('selected', isSelected);
  }

  generateCanvas(width, height) {
    this.width = width;
    this.height = height;
    this.center = [this.width / 2, this.height / 2];
    this.brushX = d3.scale.linear().range([0, width]),
    this.brushY = d3.scale.linear().range([0, height]);
    this.minimapPaddingX = constants.MINIMAP_MARGIN + constants.BUTTON_WIDTH;
    this.minimapPaddingY = height - constants.DEFAULT_MINIMAP_SIZE - constants.MINIMAP_MARGIN + 2;
    this.minimapScale = 0.25;

    this.numTicks = width / constants.GRID_LENGTH * (1 / constants.MIN_SCALE);

    this.zoom = this.initializeZoom();
    this.brush = this.initializeBrush();
    this.svg = this.initializeSVG();
    this.svgBrush = this.initializeSVGBrush();
    this.container = this.initializeContainer();
    this.curve = this.initializeCurve();
    this.svgGrid = this.initializeSVGgrid();
    this.force = this.initializeForce();
    this.drag = this.intitializeDrag();
    this.dragLink = this.initializeDragLink();
    this.initializeMenuActions();
    this.initializeContextMenu();
    this.initializeMarkers();

    this.initializeToolbarButtons();
    this.initializeZoomButtons();
    this.initializeButton(constants.BUTTON_POINTER_TOOL_ID, () => {
      d3.select('#' + constants.BUTTON_SELECTION_TOOL_ID).classed('selected', false); 
      d3.select('#' + constants.BUTTON_POINTER_TOOL_ID).classed('selected', true);
    }, true); // Placeholder method
    this.initializeButton(constants.BUTTON_SELECTION_TOOL_ID, () => {
      d3.select('#' + constants.BUTTON_POINTER_TOOL_ID).classed('selected', false);
      d3.select('#' + constants.BUTTON_SELECTION_TOOL_ID).classed('selected', true);
    }); // Placeholder method
    this.initializeButton(constants.BUTTON_EDIT_MODE_ID, () => { this.toggleEditMode() });
    this.initializeButton(constants.BUTTON_FIX_NODE_ID, () => { this.toggleFixedNodes() });
    this.initializeButton(constants.BUTTON_SIMPLIFY_ID, () => {
      this.hideTypeNodes(DOCUMENT);
      this.groupSame();
    });
    this.initializeButton(constants.BUTTON_TOGGLE_MINIMAP_ID, () => { this.minimap.toggleMinimapVisibility(); }); // Wrap in unnamed function bc minimap has't been initialized yet
    this.initializeButton(constants.BUTTON_UNDO_ACTION_ID, () => {}); // Placeholder method
    this.initializeButton(constants.BUTTON_REDO_ACTION_ID, () => {}); // Placeholder method
    this.initializeButton(constants.BUTTON_SAVE_PROJECT_ID, () => { this.saveAllData() }); // Placeholder method

    this.setupKeycodes();

    // Create selectors
    this.hull = this.container.append('g').selectAll('.hull')
    this.link = this.container.append('g').selectAll('.link');
    this.node = this.container.append('g').selectAll('.node');

    this.force.on('tick', (e) => { this.ticked(e, this) });

    this.minimap = new Minimap()
                    .setZoom(this.zoom)
                    .setTarget(this.container) // that's what you're trying to track/the images
                    .setMinimapPositionX(this.minimapPaddingX)
                    .setMinimapPositionY(this.minimapPaddingY)
                    .setGraph(this);

    this.minimap.initializeMinimap(this.svg, this.width, this.height);
  }

  // Completely rerenders the graph, assuming all new nodes and links
  setData(centerid, nodes, links, byIndex) {
    this.setMatrix(nodes, links, byIndex);
    this.initializeDataDicts(); // if we're setting new data, reset to fresh settings for hidden, nodes, isDragging, etc.
    this.update();

    // set global node id to match the nodes getting passed in
    nodes.map((node) => {
      if (node.id < 0) { this.globalnodeid = Math.min(this.globalnodeid, node.id); }
    });

    links.map((link) => {
      if (link.id < 0) { this.globallinkid = Math.min(this.globallinkid, link.id); }
    });

    for (let i = 150; i > 0; --i) this.force.tick();  
    this.reloadNeighbors();

    this.minimap
      .setBounds(document.querySelector('svg'), this.xbound[0], this.xbound[1], this.ybound[0], this.ybound[1])
      .initializeBoxToCenter(document.querySelector('svg'), this.xbound[0], this.xbound[1], this.ybound[0], this.ybound[1]); 
  }

  addData(centerid, nodes, links) {
    this.addToMatrix(centerid, nodes, links);
  }

  fetchData() {
    return { nodes: this.nodes, links: this.links };
  }

  bindDisplayFunctions(displayFunctions) {
    this.displayNodeInfo = displayFunctions.node ? displayFunctions.node : function(d) {};
    this.displayLinkInfo = displayFunctions.link ? displayFunctions.link : function(d) {};
    this.displayGroupInfo = displayFunctions.group ? displayFunctions.group : function(d) {};
    this.expandNodeFromData = displayFunctions.expand ? displayFunctions.expand : function(d) {};
    this.saveAllData = displayFunctions.save ? displayFunctions.save : function(d) {};
    this.initializeMenuActions();
  }

  // Updates nodes and links according to current data
  update(event=null, ticks=null, minimap=true) {
    var self = this;

    this.resetGraphOpacity();

    this.force.stop();
    this.matrixToGraph();
    this.reloadNeighbors(); 

    this.force
      .gravity(.33)
      .charge((d) => { return d.group ? -7500 : -20000})
      .linkDistance((l) => { return (l.source.group && l.source.group === l.target.group) ? constants.GROUP_LINK_DISTANCE : constants.LINK_DISTANCE })
      .alpha(.8)
      .nodes(this.nodes)
      .links(this.links);

    // Update links
    this.link = this.link.data(this.links, (d) => { return d.id; }); //resetting the key is important because otherwise it maps the new data to the old data in order
    this.link
      .enter().append('line')
      .attr('class', 'link')
      .classed('same-as', (l) => { return utils.isPossibleLink(l.type); })
      .classed('faded', (l) => { return this.hoveredNode && !(l.source == this.hoveredNode || l.target == this.hoveredNode); })
      .on('mouseover', this.mouseoverLink)
      .call(this.styleLink, false);
    this.link.exit().remove();

    // Update nodes
    this.node = this.node.data(this.nodes, (d) => { return d.id; });
    this.nodeEnter = this.node.enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', function (d) { self.clicked(d, this); })
      .on('dblclick', function (d) { self.dblclicked(d, this); })
      .on('mousedown', function (d) { self.mousedown(d, this); })
      .on('mouseover', function (d) { self.mouseover(d, this); })
      .on('mouseout', function (d) { self.mouseout(d, this); })
      .on('contextmenu', this.contextMenu(this.menuActions))
      .classed('fixed', (d) => { return d.fixed; })
      .classed('faded', (d) => { return this.hoveredNode && !this.areNeighbors(this.hoveredNode, d); })
      .call(this.drag);

    if (this.editMode) {
      this.nodeEnter
        .on('mousedown.drag', null)
        .on('mousedown', function (d) { self.mousedown(d, this); })
        .on('mouseup', function (d) { self.mouseup(d, this); });
    }

    this.nodeEnter.append('circle');

    this.nodeEnter.append('text')
      .attr('class', 'icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '21px')
      .text((d) => { return (!d.group && d.type && icons[d.type]) ? icons[d.type] : ''; })
      .classed('unselectable', true);

    this.nodeEnter.append('text')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .attr('dy', '40px')
      .text((d) => { return d.group ? '' : utils.processNodeName(utils.getName(d), this.printFull); })
      .call(this.textWrap, this.printFull)
      .on('click', function (d) { self.stopPropagation(); })
      .on('mouseover', function (d) { self.stopPropagation(); })
      .on('mouseout', function (d) { self.stopPropagation(); })
      .call(d3.behavior.drag()
        .on('dragstart', this.stopPropagation)
        .on('drag', this.stopPropagation)
        .on('dragend', this.stopPropagation)
      );

    this.node.call(this.styleNode)
    this.node.exit().remove();

    // Update hulls
    this.hull = this.hull.data(this.hulls);
    this.hull
      .enter().append('path')
      .attr('class', 'hull')
      .attr('d', this.drawHull)
      .classed('faded', this.hoveredNode)
      .on('dblclick', function (d) {
        self.toggleGroupView(d.groupId);
        d3.event.stopPropagation();
      });

    this.hull.exit().remove();
 
    this.force.start();
    // Avoid initial chaos and skip the wait for graph to drift back onscreen
    if (ticks) { for (let i = ticks; i > 0; --i) this.force.tick(); }   

    if (minimap) { 
      this.toRenderMinimap = true;
      this.tickCount = 0;
    }
    
    this.node.each(function(d) {
      if (d.fixedTransition) {
        d.fixed = d.fixedTransition = false;
      }
    });

    this.highlightExpandableNode();
  }

  // Occurs each tick of simulation
  ticked(e, self) {
    const classThis = this;
    // this.force.resume();
    this.xbound = [this.width, 0];
    this.ybound = [this.height, 0];
    this.tickCount += 1;

    if (e.alpha < 0.025) {
      this.force.stop();
      return;
    }

    this.node
      .each(this.groupNodesForce(.3))
      .each((d) => {
        d.px = d.x; d.py = d.y;
        if (d.x < this.xbound[0]) { this.xbound[0] = d.x; } 
        if (d.x > this.xbound[1]) { this.xbound[1] = d.x; }
        if (d.y < this.ybound[0]) { this.ybound[0] = d.y; } 
        if (d.y > this.ybound[1]) { this.ybound[1] = d.y; }
      })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    if (this.toRenderMinimap) { 
      if (this.tickCount === constants.MINIMAP_TICK) {
        this.minimap.syncToSVG(document.querySelector('svg'), this.xbound[0], this.xbound[1], this.ybound[0], this.ybound[1]);
        this.tickCount = 0;
        this.toRenderMinimap = false;
      }
    }

    if (!this.hull.empty()) {
      this.calculateAllHulls();
      this.hull.data(this.hulls)
        .attr('d', this.drawHull);
    }

    this.link
      .each(function(l) {
        const x1 = l.source.x,
              y1 = l.source.y,
              x2 = l.target.x,
              y2 = l.target.y;
        const dist = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        const sourcePadding = l.target.radius + (l.bidirectional ? constants.MARKER_PADDING : 0),
              targetPadding = l.source.radius + constants.MARKER_PADDING;
        l.sourceX = x1 + (x2-x1) * (dist-sourcePadding) / dist;
        l.sourceY = y1 + (y2-y1) * (dist-sourcePadding) / dist;
        l.targetX = x2 - (x2-x1) * (dist-targetPadding) / dist;
        l.targetY = y2 - (y2-y1) * (dist-targetPadding) / dist;
      })
      .attr('x1', (l) => { return l.sourceX; })
      .attr('y1', (l) => { return l.sourceY; })
      .attr('x2', (l) => { return l.targetX; })
      .attr('y2', (l) => { return l.targetY; });

    if (this.editMode && this.mousedownNode) {
      const x1 = this.mousedownNode.x * this.zoomScale + this.zoomTranslate[0],
            y1 = this.mousedownNode.y * this.zoomScale + this.zoomTranslate[1],
            x2 = this.dragLink.attr('tx2'),
            y2 = this.dragLink.attr('ty2'),
            dist = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));

      if (dist > 0) {
        const targetX = x2 - (x2-x1) * (dist-this.mousedownNode.radius*this.zoomScale) / dist,
              targetY = y2 - (y2-y1) * (dist-this.mousedownNode.radius*this.zoomScale) / dist;

      this.dragLink
        .attr('x1', targetX)
        .attr('y1', targetY)
        .attr('x2', x2)
        .attr('y2', y2);
      }
    }
  }

  // Custom force that takes the parent group position as the centroid to moves all contained nodes toward
  groupNodesForce(alpha) {
    var self = this;
    // Only apply force on grouped nodes that aren't being dragged and aren't fixed
    return function (d) {
      if (d.group && (!self.isDragging || d.id != self.draggedNode.id) && !d.fixed) {
        d.y += (d.centroidy - d.y) * alpha;
        d.x += (d.centroidx - d.x) * alpha;
      }
    }
  }

  // Graph manipulation keycodes
  setupKeycodes() {
    d3.select('body')
      .on('keydown', () => {

        if (d3.event.target.nodeName === 'INPUT') {
          return this.force.resume();
        }

        // u: Unpin selected nodes
        if (d3.event.keyCode == 85) {
          this.svg.selectAll('.node.selected')
            .each(function (d) { d.fixed = false; })
            .classed('fixed', false);
        }

        // g: Group selected nodes
        else if (d3.event.keyCode == 71) {
          this.groupSelectedNodes();
        }

        // h: Ungroup selected nodes
        else if (d3.event.keyCode == 72) {
          this.ungroupSelectedGroups();
        }

        // c: Group all of the possibly same as's
        else if (d3.event.keyCode == 67) {
          this.groupSame();
        }

        // e: Toggle edit mode
        else if (d3.event.keyCode == 69) {
          this.toggleEditMode();
        }

        // r/del: Remove selected nodes/links
        else if ((d3.event.keyCode == 82 || d3.event.keyCode == 46) && this.editMode) {
          this.deleteSelectedNodes();
        }
        // l: remove selected links only
        else if (d3.event.keyCode == 76 && this.editMode) {
          this.deleteSelectedLinks();
        }

        // a: Add node linked to selected
        else if (d3.event.keyCode == 65 && this.editMode) {
          const selection = this.svg.selectAll('.node.selected');
          this.addNodeToSelected(selection);
        }

        // // o: save as PNG
        // else if (d3.event.keyCode == 79) {
        //   this.saveAsPng();
        // }

        // d: Hide document nodes
        else if (d3.event.keyCode == 68) {
          this.toggleTypeView(DOCUMENT);
        }

        // p: Toggle btwn full/abbrev text
        else if (d3.event.keyCode == 80) {
          this.printFull = (this.printFull + 1) % 3;
          this.selectAllNodeNames()
              .text((d) => { return utils.processNodeName(utils.getName(d), this.printFull); })
              .call(this.textWrap, this.printFull);
        }
        
        // t: expand by degree
        else if (d3.event.keyCode == 84) {
          if (this.degreeExpanded === 0 && this.nodes.length !== 1) { return; }
          
          if (this.degreeExpanded === 0 && this.nodes.length === 1) {
            this.expandingNode = this.nodes[0];
          }

          this.degreeExpanded += 1;

          if (this.degreeExpanded <= 4) {
            d3.json(`/data/well_connected_${this.degreeExpanded}.json`, (json) => {
              this.addToMatrix(0, json.nodes, json.links);
            });
          }
        }
      });
  }

  toggleFixedNodes() {
    const self = this;
    this.isGraphFixed = !this.isGraphFixed;
    d3.selectAll('.node')
      .each(function (d) {
        const currNode = d3.select(this);
        currNode.classed('fixed', d.fixed = self.isGraphFixed)
      });
  }

  toggleEditMode() {
    const self = this;
    this.editMode = !this.editMode;
    const button = d3.select('#' + constants.BUTTON_EDIT_MODE_ID);
    button.classed('selected', this.editMode);
    if (this.editMode) {
      if (!this.dragCallback) { this.dragCallback = this.node.property('__onmousedown.drag')['_'] };
      this.svg
        .on('click', function () { self.clickedCanvas(this); })
        .on('mousemove', function () { self.mousemoveCanvas(this); });
      this.node
        .on('mousedown.drag', null)
        .on('mouseup', function (d) { self.mouseup(d, this); });
      this.dragLink.style('visibility', 'visible');
    } else {
      this.svg
        .on('click', null)
        .on('mousemove', null);
      this.node
        .on('mouseup', null)
        .on('mousedown.drag', this.dragCallback);
      this.dragCallback = null;
      this.dragLink.style('visibility', 'hidden');
    }
  }

  // =================
  // SELECTION METHODS
  // =================

  // Get all node text elements
  selectAllNodeNames() {
    return d3.selectAll('text')
      .filter(function (d) { return d3.select(this).classed('node-name'); });
  }

  // Determine if neighboring nodes
  areNeighbors(a, b) {
    return this.linkedById[a.id + ',' + b.id]
      || this.linkedById[b.id + ',' + a.id]
      || a.id == b.id;
  }

  reloadNeighbors() {
    this.linkedById = {};
    this.links.forEach((d) => {
      this.linkedById[d.source.id + "," + d.target.id] = d.id;
      if (d.bidirectional) this.linkedById[d.target.id + "," + d.source.id] = d.id;
    });
  }

  reloadIdToIndex() {
    this.idToIndex = {};
    this.indexToId = {};
    for (var i = 0; i < this.adjacencyMatrix.length; i++) {
      let id = this.adjacencyMatrix[i][i].data.id
      this.idToIndex[id] = i;
      this.indexToId[i] = id;
    }
  }

  saveGraphAsSVGString() {
    return utils.createSVGString(document.querySelector('svg'), this.xbound[0], this.xbound[1], this.ybound[0], this.ybound[1])
  }
}

//From aesthetics.js
Graph.prototype.highlightExpandableNode = aesthetics.highlightExpandableNode;
Graph.prototype.highlightLinksFromAllNodes = aesthetics.highlightLinksFromAllNodes;
Graph.prototype.highlightLinksFromNode = aesthetics.highlightLinksFromNode;
Graph.prototype.styleNode = aesthetics.styleNode;
Graph.prototype.styleLink = aesthetics.styleLink;
Graph.prototype.fillGroupNodes = aesthetics.fillGroupNodes;
Graph.prototype.fadeGraph = aesthetics.fadeGraph;
Graph.prototype.resetGraphOpacity = aesthetics.resetGraphOpacity;
Graph.prototype.resetDragLink = aesthetics.resetDragLink;
Graph.prototype.textWrap = aesthetics.textWrap;

//From mouseClicks.js
Graph.prototype.brushstart = mouseClicks.brushstart;
Graph.prototype.brushing = mouseClicks.brushing;
Graph.prototype.brushend = mouseClicks.brushend;
Graph.prototype.clicked = mouseClicks.clicked;
Graph.prototype.rightclicked = mouseClicks.rightclicked;
Graph.prototype.dblclicked = mouseClicks.dblclicked;
Graph.prototype.dragstart = mouseClicks.dragstart;
Graph.prototype.dragging = mouseClicks.dragging;
Graph.prototype.dragend = mouseClicks.dragend;
Graph.prototype.mousedown = mouseClicks.mousedown;
Graph.prototype.mouseup = mouseClicks.mouseup;
Graph.prototype.mouseover = mouseClicks.mouseover;
Graph.prototype.mouseout = mouseClicks.mouseout;
Graph.prototype.clickedCanvas = mouseClicks.clickedCanvas;
Graph.prototype.dragstartCanvas = mouseClicks.dragstartCanvas;
Graph.prototype.mouseupCanvas = mouseClicks.mouseupCanvas;
Graph.prototype.mousemoveCanvas = mouseClicks.mousemoveCanvas;
Graph.prototype.mouseoverLink = mouseClicks.mouseoverLink;
Graph.prototype.stopPropagation = mouseClicks.stopPropagation;

Graph.prototype.zoomstart = mouseClicks.zoomstart;
Graph.prototype.zooming = mouseClicks.zooming;
Graph.prototype.performZoom = mouseClicks.performZoom;
Graph.prototype.zoomend = mouseClicks.zoomend;
Graph.prototype.zoomButton = mouseClicks.zoomButton;
Graph.prototype.translateGraphAroundNode = mouseClicks.translateGraphAroundNode;
Graph.prototype.translateGraphAroundId = mouseClicks.translateGraphAroundId;
Graph.prototype.disableZoom = mouseClicks.disableZoom;
Graph.prototype.manualZoom = mouseClicks.manualZoom;

//From changeD3Data.js
Graph.prototype.deleteSelectedNodes = d3Data.deleteSelectedNodes;
Graph.prototype.deleteSelectedLinks = d3Data.deleteSelectedLinks;
Graph.prototype.addNodeToSelected = d3Data.addNodeToSelected;
Graph.prototype.toggleTypeView = d3Data.toggleTypeView;
Graph.prototype.hideTypeNodes = d3Data.hideTypeNodes;
Graph.prototype.showHiddenType = d3Data.showHiddenType;
Graph.prototype.groupSame = d3Data.groupSame;
Graph.prototype.groupSelectedNodes = d3Data.groupSelectedNodes;
Graph.prototype.ungroupSelectedGroups = d3Data.ungroupSelectedGroups;
Graph.prototype.expandGroups = d3Data.expandGroups;
Graph.prototype.toggleGroupView = d3Data.toggleGroupView;
Graph.prototype.createHull = d3Data.createHull;
Graph.prototype.calculateAllHulls = d3Data.calculateAllHulls;
Graph.prototype.drawHull = d3Data.drawHull;
Graph.prototype.addLink = d3Data.addLink;
Graph.prototype.selectLink = d3Data.selectLink;

//From tooltips
Graph.prototype.initializeTooltip = tt.initializeTooltip;
Graph.prototype.displayTooltip = tt.displayTooltip;
Graph.prototype.displayDebugTooltip = tt.displayDebugTooltip;
Graph.prototype.hideTooltip = tt.hideTooltip;
Graph.prototype.moveTooltip = tt.moveTooltip;
Graph.prototype.populateNodeInfoBody = tt.populateNodeInfoBody;
Graph.prototype.displayData = tt.displayData;
Graph.prototype.createTitleElement = tt.createTitleElement;

//from matrix
Graph.prototype.setMatrix = matrix.setMatrix;
Graph.prototype.addToMatrix = matrix.addToMatrix;
Graph.prototype.matrixToGraph = matrix.matrixToGraph;

Graph.prototype.createNode = matrix.createNode;
Graph.prototype.createLink = matrix.createLink;
Graph.prototype.deleteNode = matrix.deleteNode;
Graph.prototype.deleteLink = matrix.deleteLink;
Graph.prototype.hideNode = matrix.hideNode;
Graph.prototype.hideLink = matrix.hideLink;
Graph.prototype.displayLink = matrix.displayLink;
Graph.prototype.displayNode = matrix.displayNode;

Graph.prototype.setGroupMembers = matrix.setGroupMembers;
Graph.prototype.createGroup = matrix.createGroup;
Graph.prototype.getGroupMembers = matrix.getGroupMembers;
Graph.prototype.copyLinks = matrix.copyLinks;
Graph.prototype.ungroup = matrix.ungroup;
Graph.prototype.expandGroup = matrix.expandGroup;
Graph.prototype.collapseGroup = matrix.collapseGroup;
Graph.prototype.getParent = matrix.getParent;

// Uncomment below for React implementation
export default Graph;
