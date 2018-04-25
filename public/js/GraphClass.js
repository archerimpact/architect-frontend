'use strict';
// FontAwesome icon unicode-to-node type dict
// Use this to find codes for FA icons: https://fontawesome.com/cheatsheet

// Uncomment below for React implementation
// import * as d3 from 'd3';
// import 'font-awesome/css/font-awesome.min.css'
// import './helpers/aesthetics.js'
// import './helpers/utils.js'
// import './helpers/mouseClicks.js'
// import './helpers/tooltips.js'
// import './changeD3Data.js'

const icons = {
  "person": "",
  "Document": "",
  "corporation": "",
  "group": "",
  "same_as_group": ""
};

const maxTextLength = 20;
const minScale = 0.1;
const maxScale = 9.0;
const gridLength = 80;
    
class Graph {
  constructor() {
    this.height = null;
    this.width = null;
    this.center = null;
    this.brushX = null;
    this.brushY = null;
    this.numTicks = null;

    this.editMode = false; // Keep track of edit mode (add/remove/modify nodes + links)
    this.isDragging = false; // Keep track of dragging to disallow node emphasis on drag
    this.draggedNode = null; // Store reference to currently dragged node, null otherwise
    this.isBrushing = false;
    this.isEmphasized = false; // Keep track of node emphasis to end node emphasis on drag
    this.hoveredNode = null; // Store reference to currently hovered/emphasized node, null otherwise
    this.printFull = 0; // Allow user to toggle node text length
    this.isGraphFixed = false; // Track whether or not all nodes should be fixed
    this.zoomTranslate = [0, 0]; // Keep track of original zoom state to restore after right-drag
    this.zoomScale = 1;
    this.zoomPressed = null;
    this.debug = true; // Show all node/link attributes in tooltip

    this.node = null;
    this.link = null;
    this.hull = null;
    this.nodes = null;
    this.links = null;
    this.nodeEnter = null;
    this.zoom = null;
    this.brush = null;
    this.svg = null;
    this.svgBrush = null;
    this.container = null;
    this.curve = null;
    this.svgGrid = null;
    this.force = null;

    this.ticked = this.ticked.bind(this);
    this.brushstart = this.brushstart.bind(this);
    this.brushing = this.brushing.bind(this);
    this.brushend = this.brushend.bind(this);
    this.clicked = this.clicked.bind(this);
    this.rightclicked = this.rightclicked.bind(this);
    this.dblclicked = this.dblclicked.bind(this);
    this.isRightClick = this.isRightClick.bind(this);
    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.clickedCanvas = this.clickedCanvas.bind(this);
    this.dragstartCanvas = this.dragstartCanvas.bind(this);
    this.mouseoverLink = this.mouseoverLink.bind(this);
    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.zoomstart = this.zoomstart.bind(this);
    this.zooming = this.zooming.bind(this);
    this.zoomend = this.zoomend.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.initializeZoom = this.initializeZoom.bind(this);
    this.initializeBrush = this.initializeBrush.bind(this);
    this.drawHull = this.drawHull.bind(this);
    this.doZoom = this.doZoom.bind(this);
    this.initializeZoomButtons = this.initializeZoomButtons.bind(this);
    this.textWrap = this.textWrap.bind(this);
    this.displayTooltip = this.displayTooltip.bind(this);
    this.populateNodeInfoBody = this.populateNodeInfoBody.bind(this);

    this.bindDisplayFunctions({}); //no display functions yet
  }

  initializeDataDicts() {
    this.groups = {}; // Store groupNodeId --> {links: [], nodes: [], groupid: int}
    this.expandedGroups = {}; // Store groupNodeId --> expansion state
    this.hidden = { links: [], nodes: [] }; // Store all links and nodes that are hidden  
    this.nodeSelection = {}; // Store node.index --> selection state
    this.linkedByIndex = {}; // Store each pair of neighboring nodes

    this.globallinkid = -1;
    this.globalnodeid = -1;
  }

  initializeZoom() {
    var self = this;
    const zoom = d3.behavior.zoom()
      .scaleExtent([minScale, maxScale])
      .on('zoomstart', function (d) { self.zoomstart(d, this) })
      .on('zoom', function (d) { self.zooming(d, this) })
      .on('zoomend', function (d) { self.zoomend(d, this) });

    return zoom;
  }

  initializeBrush() {
    var self = this;
    return d3.svg.brush()
      .on('brushstart', function (d) { self.brushstart(d, this) })
      .on('brush', function (d) { self.brushing(d, this) })
      .on('brushend', function (d) { self.brushend(d, this) })
      .x(self.brushX).y(self.brushY);
  }

  // Create canvas
  initializeSVG() {
    const svg = d3.select('#graph-container').append('svg')
      .attr('id', 'canvas')
      .attr("pointer-events", "all")
      .classed("svg-content", true)
      .on('click', this.clickedCanvas)
      .call(d3.behavior.drag()
        .on('dragstart', this.dragstartCanvas)
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
      svgBrush.style('opacity', this.isRightClick() ? 1 : 0);
    });

    return svgBrush;
  }


  // We need this reference because selectAll and listener calls will refer to svg, 
  // whereas new append calls must be within the same g, in order for zoom to work.
  initializeContainer() {
    return this.svg.append('g');
  }

  //set up how to draw the hulls
  initializeCurve() {
    return d3.svg.line()
      .interpolate('cardinal-closed')
      .tension(.85);
  }


  initializeSVGgrid() {
    const svgGrid = this.container.append('g');
    svgGrid
      .append('g')
      .attr('class', 'x-ticks')
      .selectAll('line')
      .data(d3.range(0, (this.numTicks + 1) * gridLength, gridLength))
      .enter().append('line')
      .attr('x1', (d) => { return d; })
      .attr('y1', (d) => { return -1 * gridLength; })
      .attr('x2', (d) => { return d; })
      .attr('y2', (d) => { return (1 / minScale) * this.height + gridLength; });

    svgGrid
      .append('g')
      .attr('class', 'y-ticks')
      .selectAll('line')
      .data(d3.range(0, (this.numTicks + 1) * gridLength, gridLength))
      .enter().append('line')
      .attr('x1', (d) => { return -1 * gridLength; })
      .attr('y1', (d) => { return d; })
      .attr('x2', (d) => { return (1 / minScale) * this.width + gridLength; })
      .attr('y2', (d) => { return d; });

    return svgGrid;
  }

  initializeForce() {
    return d3.layout.force()
      .linkDistance(100)
      .size([this.width, this.height]);
  }

  initializeZoomButtons() {
    var self = this;
    this.svg.selectAll(".button")
      //.data(['zoom_in', 'zoom_out'])
      .data([{ label: 'zoom_in' }, { label: 'zoom_out' }])
      .enter()
      //.append("text").text("hi")
      .append("rect")
      .attr("x", function (d, i) { return 10 + 50 * i })
      .attr({ y: 10, width: 40, height: 20, class: "button" })
      .attr("id", function (d) { return d.label })
      .style("fill", function (d, i) { return i ? "red" : "green" });
    // .attr("text", function(d,i){ return i ? "red" : "green"})
    // .attr("label", function(d,i){ return i ? "red" : "green"})

    // svg.selectAll(".button").append("text").text("hi")

    // Control logic to zoom when buttons are pressed, keep zooming while they are
    // pressed, stop zooming when released or moved off of, not snap-pan when
    // moving off buttons, and restore pan on mouseup.

    this.zoomPressed = false;
    d3.selectAll('.button').on('mousedown', function () {
      self.zoomPressed = true;
      self.disableZoom();
      self.doZoom(this.id === 'zoom_in')
    })
    .on('mouseup', function () {
      self.zoomPressed = false;
    })
    .on('mouseout', function () {
      self.zoomPressed = false;
    })
    .on('click', this.stopPropagation)
    .on('dblclick', this.stopPropagation);

    this.svg.on("mouseup", () => { this.svg.call(this.zoom) });
  }

  generateCanvas(width, height) {
    this.width = width;
    this.height = height;
    this.center = [this.width / 2, this.height / 2];
    this.brushX = d3.scale.linear().range([0, width]),
    this.brushY = d3.scale.linear().range([0, height]);

    this.numTicks = width / gridLength * (1 / minScale);

    this.zoom = this.initializeZoom();
    this.brush = this.initializeBrush();
    this.svg = this.initializeSVG();
    this.svgBrush = this.initializeSVGBrush();
    this.container = this.initializeContainer();
    this.curve = this.initializeCurve();
    this.svgGrid = this.initializeSVGgrid();
    this.force = this.initializeForce();
    this.initializeZoomButtons();
    this.initializeTooltip();

    this.setupKeycodes();

    // Create selectors
    this.hull = this.container.append('g').selectAll('.hull')
    this.link = this.container.append('g').selectAll('.link');
    this.node = this.container.append('g').selectAll('.node');
  }

  // Completely rerenders the graph, assuming all new nodes and links
  // centerid currently doesn't do anything
  setData(centerid, nodes, links) {
    this.initializeDataDicts(); // if we're setting new data, reset to fresh settings for hidden, nodes, isDragging, etc.

    this.nodes = nodes;
    this.links = links;
    this.hulls = [];

    // Needed this code when loading 43.json to prevent it from disappearing forever by pinning the initial node
    // var index
    //   nodes.map((node, i)=> {
    //     if (node.id===43) {
    //       index = i
    //     }
    //   })

    //   nodes[index].fixed = true;
    //   nodes[index].px = width/2
    //   nodes[index].py = height/2; 

    this.force
      .gravity(.33)
      .charge(-1 * Math.max(Math.pow(110*this.nodes.length/this.links.length, 2.5), 1250))
      .friction(this.nodes.length < 15 ? .75 : .65)
      .alpha(.8)
      .nodes(this.nodes)
      .links(this.links);

    // Updates nodes and links according to current data
    this.update();

    this.force.on('tick', (e) => { this.ticked(e, this) });
    // Avoid initial chaos and skip the wait for graph to drift back onscreen
    for (let i = 750; i > 0; --i) this.force.tick();      

    // var centerd;
    // this.nodes.map((d)=> {
    //   if (d.id === centerid) {
    //     centerd = d;
    //   }
    // });

    // this.translateGraphAroundNode(centerd);
  }

  bindDisplayFunctions(displayFunctions) {
    this.displayNodeInfo = displayFunctions.node ? displayFunctions.node : function(d) {};
    this.displayLinkInfo = displayFunctions.link ? displayFunctions.link : function(d) {};
    this.displayGroupInfo = displayFunctions.group ? displayFunctions.group : function(d) {};
  }

  update() {
    var self = this;
    this.link = this.link.data(this.links, function (d) { return d.id; }); //resetting the key is important because otherwise it maps the new data to the old data in order
    this.link
      .enter().append('line')
      .attr('class', 'link')
      .style('stroke-dasharray', function (d) { return d.type === 'possibly_same_as' ? ('3,3') : false; })
      .on('mouseover', this.mouseoverLink);

    this.link.exit().remove();

    this.node = this.node.data(this.nodes, function (d) { return d.id; });
    this.nodeEnter = this.node.enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', function (d) { self.clicked(d, this); })
      .on('dblclick', function (d) { self.dblclicked(d, this); })
      .on('mouseover', function (d) { self.mouseover(d, this); })
      .on('mouseout', function (d) { self.mouseout(d, this); })
      .classed('fixed', function (d) { return d.fixed; })
      .call(this.force.drag()
        .origin(function (d) { return d; })
        .on('dragstart', function (d) { self.dragstart(d, this) })
        .on('drag', function (d) { self.dragging(d, this) })
        .on('dragend', function (d) { self.dragend(d, this) })
      );

    this.nodeEnter.append('circle')
      .attr('r', '20');

    this.nodeEnter.append('text')
      .attr('class', 'icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '20px')
      .text(function (d) { return (d.type && icons[d.type]) ? icons[d.type] : ''; });

    this.nodeEnter.append('text')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .attr('dy', '35px')
      .text(function (d) { return processNodeName(d.name, this.printFull); })
      .call(this.textWrap, this.printFull)
      .on('click', this.stopPropagation)
      .on('mouseover', this.stopPropagation)
      .on('mouseout', this.stopPropagation)
      .call(d3.behavior.drag()
        .on('dragstart', this.stopPropagation)
        .on('drag', this.stopPropagation)
        .on('dragend', this.stopPropagation)
      );

    this.node.exit().remove();

    this.hull = this.hull.data(this.hulls);

    this.hull
      .enter().append('path')
      .attr('class', 'hull')
      .attr('d', this.drawHull)
      .on('dblclick', function (d) {
        self.toggleGroupView(d.groupId);
        d3.event.stopPropagation();
      })
    this.hull.exit().remove();

    this.force.start();
    this.reloadNeighbors();
  }

  // Occurs each tick of simulation
  ticked(e, self) {
    this.force.resume();
    if (!this.hull.empty()) {
      this.calculateAllHulls();
      this.hull.data(this.hulls)
        .attr('d', this.drawHull);
    }

    this.node
      .each(this.groupNodesForce(.3))
      .each(function(d) {d.px = d.x; d.py = d.y;})
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    this.link
      .attr('x1', function (d) { return d.source.x; })
      .attr('y1', function (d) { return d.source.y; })
      .attr('x2', function (d) { return d.target.x; })
      .attr('y2', function (d) { return d.target.y; });
  }

  // Custom force that takes the parent group position as the centroid to moves all contained nodes toward
  groupNodesForce(alpha) {
    var self = this;
    // Only apply force on grouped nodes that aren't being dragged and aren't fixed
    return function (d) {
      if (d.group && (!self.isDragging || d.id != self.draggedNode.id) && !d.fixed) {
        d.y += (d.cy - d.y) * alpha;
        d.x += (d.cx - d.x) * alpha;
      }
    }
  }

  // Graph manipulation keycodes
  setupKeycodes() {
    d3.select('body')
      .on('keydown', () => {
        // u: Unpin selected nodes
        if (d3.event.keyCode == 85) {
          this.svg.selectAll('.node.selected')
            .each(function (d) { d.fixed = false; })
            .classed('fixed', false);
        }

        // c: Group all of the possibly same as's
        else if (d3.event.keyCode == 67) {
          this.groupSame();
        }

        // f: Toggle stickiness of all the nodes
        else if (d3.event.keyCode == 70) {
          this.toggleFixedNodes();
        }

        // e: Toggle edit mode
        else if (d3.event.keyCode == 69) {
          this.editMode = !this.editMode;
          console.log(this.editMode)
        }

        // g: Group selected nodes
        else if (d3.event.keyCode == 71) {
          this.groupSelectedNodes();
        }

        // h: Ungroup selected nodes
        else if (d3.event.keyCode == 72) {
          this.ungroupSelectedGroups();
        }

        // r/del: Remove selected nodes/links
        else if ((d3.event.keyCode == 82 || d3.event.keyCode == 46) && this.editMode) {
          this.deleteSelectedNodes();
        }

        // a: Add node linked to selected
        else if (d3.event.keyCode == 65 && this.editMode) {
          const selection = this.svg.selectAll('.node.selected');
          this.addNodeToSelected(selection);
        }

        // d: Hide document nodes
        else if (d3.event.keyCode == 68) {
          this.toggleDocumentView();
        }

        // p: Toggle btwn full/abbrev text
        else if (d3.event.keyCode == 80) {
          this.printFull = (this.printFull + 1) % 3;
          this.selectAllNodeNames()
              .text((d) => { return processNodeName(d.name, this.printFull); })
              .call(this.textWrap, this.printFull);
        }

        this.force.resume();
      });
  }

  toggleFixedNodes() {
    d3.selectAll('.node')
      .each(function (d) {
        const currNode = d3.select(this);
        currNode.classed('fixed', d.fixed = this.isGraphFixed = !this.isGraphFixed)
      });
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
  neighbors(a, b) {
    return this.linkedByIndex[a.index + ',' + b.index]
      || this.linkedByIndex[b.index + ',' + a.index]
      || a.index == b.index;
  }

  reloadNeighbors() {
    this.linkedByIndex = {};
    this.links.forEach((d) => {
      this.linkedByIndex[d.source.index + "," + d.target.index] = true;
    });
  }
}

//From aesthetics.js
Graph.prototype.highlightLinksFromAllNodes = highlightLinksFromAllNodes;
Graph.prototype.highlightLinksFromNode = highlightLinksFromNode;
Graph.prototype.fillGroupNodes = fillGroupNodes;
Graph.prototype.resetGraphOpacity = resetGraphOpacity;
Graph.prototype.textWrap = textWrap;

//From mouseClicks.js
Graph.prototype.brushstart = brushstart;
Graph.prototype.brushing = brushing;
Graph.prototype.brushend = brushend;
Graph.prototype.clicked = clicked;
Graph.prototype.rightclicked = rightclicked;
Graph.prototype.dblclicked = dblclicked;
Graph.prototype.isRightClick = isRightClick;
Graph.prototype.dragstart = dragstart;
Graph.prototype.dragging = dragging;
Graph.prototype.dragend = dragend;
Graph.prototype.mouseover = mouseover;
Graph.prototype.mouseout = mouseout;
Graph.prototype.clickedCanvas = clickedCanvas;
Graph.prototype.dragstartCanvas = dragstartCanvas;
Graph.prototype.mouseoverLink = mouseoverLink;
Graph.prototype.stopPropagation = stopPropagation;

//From zoomPan.js
Graph.prototype.zoomstart = zoomstart;
Graph.prototype.zooming = zooming;
Graph.prototype.zoomend = zoomend;
Graph.prototype.doZoom = doZoom;
Graph.prototype.translateGraphAroundNode = translateGraphAroundNode;
Graph.prototype.disableZoom = disableZoom;
Graph.prototype.zoomingButton = zoomingButton;

//From changeD3Data.js
Graph.prototype.deleteSelectedNodes = deleteSelectedNodes;
Graph.prototype.deleteSelectedLinks = deleteSelectedLinks;
Graph.prototype.addNodeToSelected = addNodeToSelected;
Graph.prototype.toggleDocumentView = toggleDocumentView;
Graph.prototype.hideDocumentNodes = hideDocumentNodes;
Graph.prototype.hideNodes = hideNodes;
Graph.prototype.showHiddenNodes = showHiddenNodes;
Graph.prototype.groupSame = groupSame;
Graph.prototype.groupSelectedNodes = groupSelectedNodes;
Graph.prototype.ungroupSelectedGroups = ungroupSelectedGroups;
Graph.prototype.expandGroup = expandGroup;
Graph.prototype.expandGroups = expandGroups;
Graph.prototype.collapseGroupNodes = collapseGroupNodes;
Graph.prototype.toggleGroupView = toggleGroupView;
Graph.prototype.createHull = createHull;
Graph.prototype.calculateAllHulls = calculateAllHulls;
Graph.prototype.drawHull = drawHull;

Graph.prototype.removeLink = removeLink;
Graph.prototype.createGroupFromNode = createGroupFromNode;
Graph.prototype.checkLinkAddGroup = checkLinkAddGroup;
Graph.prototype.removeSelectiveLink = removeSelectiveLink;
Graph.prototype.reattachLink = reattachLink;
Graph.prototype.moveLinksFromOldNodesToGroup = moveLinksFromOldNodesToGroup;
Graph.prototype.removeNodesFromDOM = removeNodesFromDOM;
Graph.prototype.removeNodeLinksFromDOM = removeNodeLinksFromDOM;
Graph.prototype.removeNodeLinksSelectiveFromDOM = removeNodeLinksSelectiveFromDOM;
Graph.prototype.createGroupFromSelect = createGroupFromSelect;

//From tooltips
Graph.prototype.initializeTooltip = initializeTooltip;
Graph.prototype.displayTooltip = displayTooltip;
Graph.prototype.hideTooltip = hideTooltip;
Graph.prototype.moveTooltip = moveTooltip;
Graph.prototype.populateNodeInfoBody = populateNodeInfoBody;
Graph.prototype.displayData = displayData;
Graph.prototype.createTitleElement = createTitleElement;

// Uncomment below for React implementation
// export default Graph;
