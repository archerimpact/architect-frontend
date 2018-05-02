'use strict';
// FontAwesome icon unicode-to-node type dict
// Use this to find codes for FA icons: https://fontawesome.com/cheatsheet

// Uncomment below for React implementation
import * as d3 from './d3.min.js';
import * as aesthetics from './helpers/aesthetics.js';
import * as utils from './helpers/utils.js';
import * as mouseClicks from './helpers/mouseClicks.js';
import * as tt from './helpers/tooltips.js';
import * as matrix from './helpers/matrix.js';
import * as d3Data from './helpers/changeD3Data.js';
import { maxTextLength, minScale, maxScale, gridLength } from './helpers/constants.js';
import { TO_REMOVE, REMOVED, TO_HIDE, HIDDEN } from './helpers/matrixConstants.js';
import { GROUP, HULL_GROUP } from './helpers/typeConstants.js';


const icons = {
  'person': '',
  'Document': '',
  'corporation': '',
   'group': '',
  'same_as_group': ''
};
    
class Graph {
  constructor() {
    this.height = null;
    this.width = null;
    this.center = null;
    this.brushX = null;
    this.brushY = null;
    this.numTicks = null;

    this.editMode = false; // Keep track of edit mode (add/remove/modify nodes + links)
    this.dragCallback = null; // Store reference to drag callback to restore after disabling node drag
    this.dragDistance = 0; // Keep track of drag distance starting on node to disable click during edit mode
    this.mousedownNode = null; // Store reference to current node on mousedown (aka currently edited node)

    this.isDragging = false; // Keep track of dragging to disallow node emphasis on drag
    this.draggedNode = null; // Store reference to currently dragged node, null otherwise
    this.isBrushing = false;
    this.isEmphasized = false; // Keep track of node emphasis to end node emphasis on drag
    this.documentsShown = true;
    this.hoveredNode = null; // Store reference to currently hovered/emphasized node, null otherwise
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

    this.adjacencyMatrix = new Array();
    this.globalLinks = {};
    this.globalNodes = [];

    this.dragLink = null; // Dynamic link from selected node in edit mode

    this.ticked = this.ticked.bind(this);
    this.brushstart = this.brushstart.bind(this);
    this.brushing = this.brushing.bind(this);
    this.brushend = this.brushend.bind(this);
    this.clicked = this.clicked.bind(this);
    this.rightclicked = this.rightclicked.bind(this);
    this.dblclicked = this.dblclicked.bind(this);
    this.isLeftClick = this.isLeftClick.bind(this);
    this.isRightClick = this.isRightClick.bind(this);
    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.mousedown = this.mousedown.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
    this.clickedCanvas = this.clickedCanvas.bind(this);
    this.dragstartCanvas = this.dragstartCanvas.bind(this);
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
    this.initializeZoomButtons = this.initializeZoomButtons.bind(this);
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
    var self = this;
    const zoom = d3.behavior.zoom()
      .scaleExtent([minScale, maxScale])
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

  initializeMarkers() {
    this.svg.append('defs')
      .append('marker')
        .attr('id', 'end-arrow-gray')
        .attr('viewBox', '5 -5 10 10')
        .attr('refX', 10)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .style('stroke', '#545454')
        .style('fill', '#545454')
        .style('fill-opacity', 1);

    this.svg.append('defs')
      .append('marker')
        .attr('id', 'end-arrow-blue')
        .attr('viewBox', '5 -5 10 10')
        .attr('refX', 10)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .style('stroke', '#0d77e2')
        .style('fill', '#0d77e2')
        .style('fill-opacity', 1);

    this.svg.append('defs')
      .append('marker')
        .attr('id', 'start-arrow-gray')
        .attr('viewBox', '5 -5 10 10')
        .attr('refX', 10)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto-start-reverse')
      .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .style('stroke', '#545454')
        .style('fill', '#545454')
        .style('fill-opacity', 1);

    this.svg.append('defs')
      .append('marker')
        .attr('id', 'start-arrow-blue')
        .attr('viewBox', '5 -5 10 10')
        .attr('refX', 10)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto-start-reverse')
      .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .style('stroke', '#0d77e2')
        .style('fill', '#0d77e2')
        .style('fill-opacity', 1);
  }

  initializeDragLink() {
    return this.svg.append('line')
      .attr('class', 'link dynamic hidden')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 0)
      .attr('marker-end', function(d) { return d3.select(this).classed('selected') ? 'url(#end-arrow-blue)' : 'url(#end-arrow-gray)'});
  }

  initializeZoomButtons() {
    var self = this;
    this.svg.selectAll('.button')
      //.data(['zoom_in', 'zoom_out'])
      .data([{ label: 'zoom_in' }, { label: 'zoom_out' }])
      .enter()
      //.append('text').text('hi')
      .append('rect')
      .attr('x', function (d, i) { return 10 + 50 * i })
      .attr({ y: 10, width: 40, height: 20, class: 'button' })
      .attr('id', function (d) { return d.label })
      .style('fill', function (d, i) { return i ? 'red' : 'green' });
    // .attr('text', function(d,i){ return i ? 'red' : 'green'})
    // .attr('label', function(d,i){ return i ? 'red' : 'green'})

    // svg.selectAll('.button').append('text').text('hi')

    // Control logic to zoom when buttons are pressed, keep zooming while they are
    // pressed, stop zooming when released or moved off of, not snap-pan when
    // moving off buttons, and restore pan on mouseup.

    this.zoomPressed = false;
    d3.selectAll('.button')
      .on('mousedown', function () {
        self.zoomPressed = true;
        self.disableZoom();
        self.zoomButton(this.id === 'zoom_in')
      })
      .on('mouseup', function () { self.zoomPressed = false; })
      .on('mouseout', function () { self.zoomPressed = false; })
      .on('click', this.stopPropagation)
      .on('dblclick', this.stopPropagation);

    this.svg.on('mouseup', () => { this.svg.call(this.zoom) });
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
    this.dragLink = this.initializeDragLink();
    this.initializeMarkers();
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
    this.setMatrix(nodes, links);
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
      .charge(-1 * Math.max(Math.pow(100*this.nodes.length/this.links.length, 2 + Math.log(Math.pow(this.nodes.length, 2)/(10*this.links.length))), 750))
      .friction(this.nodes.length < 15 ? .75 : .65)
      .alpha(.8)
      .nodes(this.nodes)
      .links(this.links);

    // Updates nodes and links according to current data
    this.update();

    this.force.on('tick', (e) => { this.ticked(e, this) });
    // Avoid initial chaos and skip the wait for graph to drift back onscreen
    for (let i = 150; i > 0; --i) this.force.tick();      

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
      .style('stroke-opacity', (o) => { if (this.hoveredNode) { return (o.source == this.hoveredNode || o.target == this.hoveredNode) ? 1 : .05 }; })
      .on('mouseover', this.mouseoverLink)
      .call(this.styleLink, false);

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

    if (this.editMode) {
      this.nodeEnter
        .on('mousedown.drag', null)
        .on('mousedown', function (d) { self.mousedown(d, this); })
        .on('mouseup', function (d) { self.mouseup(d, this); });
    }

    this.nodeEnter
      .filter((o) => { if (this.hoveredNode && !this.neighbors(this.hoveredNode, o)) { return o; } })
      .style('stroke-opacity', .15)
      .style('fill-opacity', .15);

    this.nodeEnter.append('circle')
      .attr('r', '20');

    this.nodeEnter.append('text')
      .attr('class', 'icon')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '20px')
      .text(function (d) { return (d.type && icons[d.type]) ? icons[d.type] : ''; })
      .classed('unselectable', true);

    this.nodeEnter.append('text')
      .attr('class', 'node-name')
      .attr('text-anchor', 'middle')
      .attr('dy', '35px')
      .text(function (d) { return utils.processNodeName(d.name, this.printFull); })
      .call(this.textWrap, this.printFull)
      .on('click', function (d) { self.stopPropagation(); })
      .on('mouseover', function (d) { self.stopPropagation(); })
      .on('mouseout', function (d) { self.stopPropagation(); })
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
        self.toggleGroupView(d.groupNode);
        d3.event.stopPropagation();
      });
    this.hull.exit().remove();

    this.force.start();
    this.reloadNeighbors();
  }

  // Occurs each tick of simulation
  ticked(e, self) {
    const classThis = this;
    this.force.resume();

    this.node
      .each(this.groupNodesForce(.3))
      .each(function(d) { d.px = d.x; d.py = d.y; })
      .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    if (!this.hull.empty()) {
      this.calculateAllHulls();
      this.hull.data(this.hulls)
        .attr('d', this.drawHull);
    }

    this.link
      .each(function(d) {
        const x1 = d.source.x,
              y1 = d.source.y,
              x2 = d.target.x,
              y2 = d.target.y;
        const dist = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        const sourcePadding = (d.bidirectional || false) ? 27 : 20,
              targetPadding = 27;
        d.sourceX = x1 + (x2-x1) * (dist-sourcePadding) / dist;
        d.sourceY = y1 + (y2-y1) * (dist-sourcePadding) / dist;
        d.targetX = x2 - (x2-x1) * (dist-targetPadding) / dist;
        d.targetY = y2 - (y2-y1) * (dist-targetPadding) / dist;
      })
      .attr('x1', function (d) { return d.sourceX; })
      .attr('y1', function (d) { return d.sourceY; })
      .attr('x2', function (d) { return d.targetX; })
      .attr('y2', function (d) { return d.targetY; });

    if (this.mousedownNode) {
      const x1 = this.mousedownNode.x * this.zoomScale + this.zoomTranslate[0],
            y1 = this.mousedownNode.y * this.zoomScale + this.zoomTranslate[1],
            x2 = this.dragLink.attr('tx2'),
            y2 = this.dragLink.attr('ty2'),
            dist = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));

      if (dist > 0) {
        const targetX = x2 - (x2-x1) * (dist-20*this.zoomScale) / dist,
              targetY = y2 - (y2-y1) * (dist-20*this.zoomScale) / dist;

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
        // u: Unpin selected nodes
        if (d3.event.keyCode == 85) {
          this.svg.selectAll('.node.selected')
            .each(function (d) { d.fixed = false; })
            .classed('fixed', false);
        }

        // f: Toggle stickiness of all the nodes
        else if (d3.event.keyCode == 70) {
          this.toggleFixedNodes();
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
          const self = this;
          this.editMode = !this.editMode;
          if (this.editMode) {
            this.dragCallback = this.node.property('__onmousedown.drag')['_'];
            this.node
              .on('mousedown.drag', null)
              .on('mousedown', function (d) { self.mousedown(d, this); })
              .on('mouseup', function (d) { self.mouseup(d, this); });

            this.svg
              .on('click', function () { self.clickedCanvas(this); })
              .on('mousemove', function () { self.mousemoveCanvas(this); });
          } else {
            this.node
              .on('mousedown', null)
              .on('mouseup', null)
              .on('mousedown.drag', this.dragCallback);

            this.svg
              .on('click', null)
              .on('mousemove', null);
          }
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
              .text((d) => { return utils.processNodeName(d.name, this.printFull); })
              .call(this.textWrap, this.printFull);
        }

        this.force.resume();
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
}

//From aesthetics.js
Graph.prototype.highlightLinksFromAllNodes = aesthetics.highlightLinksFromAllNodes;
Graph.prototype.highlightLinksFromNode = aesthetics.highlightLinksFromNode;
Graph.prototype.styleLink = aesthetics.styleLink;
Graph.prototype.fillGroupNodes = aesthetics.fillGroupNodes;
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
Graph.prototype.isLeftClick = mouseClicks.isLeftClick;
Graph.prototype.isRightClick = mouseClicks.isRightClick;
Graph.prototype.dragstart = mouseClicks.dragstart;
Graph.prototype.dragging = mouseClicks.dragging;
Graph.prototype.dragend = mouseClicks.dragend;
Graph.prototype.mousedown = mouseClicks.mousedown;
Graph.prototype.mouseup = mouseClicks.mouseup;
Graph.prototype.mouseover = mouseClicks.mouseover;
Graph.prototype.mouseout = mouseClicks.mouseout;
Graph.prototype.clickedCanvas = mouseClicks.clickedCanvas;
Graph.prototype.dragstartCanvas = mouseClicks.dragstartCanvas;
Graph.prototype.mousemoveCanvas = mouseClicks.mousemoveCanvas;
Graph.prototype.mouseoverLink = mouseClicks.mouseoverLink;
Graph.prototype.stopPropagation = mouseClicks.stopPropagation;

Graph.prototype.zoomstart = mouseClicks.zoomstart;
Graph.prototype.zooming = mouseClicks.zooming;
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
Graph.prototype.toggleDocumentView = d3Data.toggleDocumentView;
Graph.prototype.hideDocumentNodes = d3Data.hideDocumentNodes;
Graph.prototype.hideNodes = d3Data.hideNodes;
Graph.prototype.showHiddenNodes = d3Data.showHiddenNodes;
Graph.prototype.groupSame = d3Data.groupSame;
Graph.prototype.groupSelectedNodes = d3Data.groupSelectedNodes;
Graph.prototype.ungroupSelectedGroups = d3Data.ungroupSelectedGroups;
Graph.prototype.expandGroup = d3Data.expandGroup;
Graph.prototype.expandGroups = d3Data.expandGroups;
Graph.prototype.collapseGroupNodes = d3Data.collapseGroupNodes;
Graph.prototype.toggleGroupView = d3Data.toggleGroupView;
Graph.prototype.createHull = d3Data.createHull;
Graph.prototype.calculateAllHulls = d3Data.calculateAllHulls;
Graph.prototype.drawHull = d3Data.drawHull;

Graph.prototype.addLink = d3Data.addLink;
Graph.prototype.selectLink = d3Data.selectLink;
Graph.prototype.removeLink = d3Data.removeLink;
Graph.prototype.createGroupFromNode = d3Data.createGroupFromNode;
Graph.prototype.checkLinkAddGroup = d3Data.checkLinkAddGroup;
Graph.prototype.removeSelectiveLink = d3Data.removeSelectiveLink;
Graph.prototype.reattachLink = d3Data.reattachLink;
Graph.prototype.moveLinksFromOldNodesToGroup = d3Data.moveLinksFromOldNodesToGroup;
Graph.prototype.removeNodesFromDOM = d3Data.removeNodesFromDOM;
Graph.prototype.removeNodeLinksFromDOM = d3Data.removeNodeLinksFromDOM;
Graph.prototype.removeNodeLinksSelectiveFromDOM = d3Data.removeNodeLinksSelectiveFromDOM;
Graph.prototype.createGroupFromSelect = d3Data.createGroupFromSelect;

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
Graph.prototype.removeNodeFromDOM = matrix.removeNodeFromDOM;
Graph.prototype.addGroup = matrix.addGroup;
Graph.prototype.ungroup = matrix.ungroup;
Graph.prototype.toggleGroup = matrix.toggleGroup;
Graph.prototype.unhideNode = matrix.unhideNode;
Graph.prototype.addNode = matrix.addNode;
Graph.prototype.matrixAddLink = matrix.matrixAddLink;
Graph.prototype.removeInternalLinks = matrix.removeInternalLinks;
Graph.prototype.createNode = matrix.createNode;
Graph.prototype.createLink = matrix.createLink;
Graph.prototype.reattachLinks = matrix.reattachLinks;
Graph.prototype.createGroup = matrix.createGroup;
Graph.prototype.getGroup = matrix.getGroup;

// Uncomment below for React implementation
export default Graph;
