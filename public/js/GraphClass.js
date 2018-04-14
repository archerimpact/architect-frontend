'use strict';
// FontAwesome icon unicode-to-node type dict
// Use this to find codes for FA icons: https://fontawesome.com/cheatsheet
const icons = {
  "person": "",
  "Document": "",
  "corporation": "",
  "group": ""
};
const height = $(window).height(),
    width = Math.max($(window).width() - 300, height),
    brushX = d3.scale.linear().range([0, width]),
    brushY = d3.scale.linear().range([0, height]),
    maxTextLength = 20;

const minScale = 0.1;
const gridLength = 80;
const numTicks = width / gridLength * (1/minScale);

class Graph {

	constructor() {
    this.groups = {}; // Store groupNodeId --> {links: [], nodes: [], groupid: int}
    this.expandedGroups = {}; // Store groupNodeId --> expansion state
    this.hidden = {links: [], nodes: []}; // Store all links and nodes that are hidden  
		this.nodeSelection = {}; // Store node.index --> selection state
		this.linkedByIndex = {}; // Store each pair of neighboring nodes
		this.isDragging = false; // Keep track of dragging to disallow node emphasis on drag
		this.isBrushing = false;
		this.isEmphasized = false; // Keep track of node emphasis to end node emphasis on drag
		this.zoomTranslate = [0, 0]; // Keep track of original zoom state to restore after right-drag
		this.zoomScale = 1;
		this.printFull = 0; // Allow user to toggle node text length

		this.node = null;
		this.link = null;
		this.hull = null;
		this.nodes = null;
		this.links = null;
		this.nodeEnter = null;
		this.globallinkid = -1;
		this.globalnodeid = -1;
		this.zoom = this.initializeZoom();
		this.brush = this.initializeBrush();
		this.svg = this.initializeSVG();
		this.svgBrush = this.initializeSVGBrush();
		this.container = this.initializeContainer();
		this.curve = this.initializeCurve();
		this.svgGrid = this.initializeSVGgrid();
		this.force = this.initializeForce();
    this.loadData();
    this.setupKeycodes();
    this.ticked = this.ticked.bind(this);
    this.brushstart = this.brushstart.bind(this);
    this.brushing = this.brushing.bind(this);
    this.brushend = this.brushend.bind(this);
    this.clicked= this.clicked.bind(this);
    this.rightclicked = this.rightclicked.bind(this);
    this.dblclicked = this.dblclicked.bind(this);
    this.isRightClick = this.isRightClick.bind(this);
    this.dragstart = this.dragstart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragend = this.dragend.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.mouseout = this.mouseout.bind(this);
  }

  initializeZoom() {
		const zoom = d3.behavior.zoom()
		  .scaleExtent([minScale, 5])
		  .on('zoomstart', this.zoomstart)
		  .on('zoom', this.zooming)
		  .on('zoomend', this.zoomend);
		return zoom;
  }

  initializeBrush() {
  	return d3.svg.brush()
		  .on('brushstart', this.brushstart)
		  .on('brush', this.brushing)
		  .on('brushend', this.brushend)
		  .x(brushX).y(brushY);
  }

	// Create canvas
  initializeSVG() {
  	const svg = d3.select('#graph-container').append('svg')
      .attr('id', 'canvas')
      .attr('width', width)
      .attr('height', height)
      .call(this.zoom);
    // Extent invisible on left click
		svg.on('mousedown', () => {
		  svgBrush.style('opacity', isRightClick() ? 1 : 0);
		});

		// Disable context menu from popping up on right click
		svg.on('contextmenu', function (d, i) {
		  d3.event.preventDefault();
		});
		return svg;
  }

	// Normally we append a g element right after call(zoom), but in this case we don't
	// want panning to translate the brush off the screen (disabling all mouse events).
  initializeSVGBrush() {
  	return this.svg.append('g')
		  .attr('class', 'brush')
		  .call(this.brush);
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


  initializeSVGgrid(){
  	const svgGrid = this.container.append('g');
  	svgGrid
		  .append('g')
		    .attr('class', 'x-ticks')
		  .selectAll('line')
		    .data(d3.range(0, (numTicks + 1) * gridLength, gridLength))
		  .enter().append('line')
		    .attr('x1', function(d) { return d; })
		    .attr('y1', function(d) { return -1 * gridLength; })
		    .attr('x2', function(d) { return d; })
		    .attr('y2', function(d) { return (1/minScale) * height + gridLength; });

		svgGrid
		  .append('g')
		    .attr('class', 'y-ticks')
		  .selectAll('line')
		    .data(d3.range(0, (numTicks + 1) * gridLength, gridLength))
		  .enter().append('line')
		  .attr('x1', function(d) { return -1 * gridLength; })
		  .attr('y1', function(d) { return d; })
		  .attr('x2', function(d) { return (1/minScale) * width + gridLength; })
		  .attr('y2', function(d) { return d; });
		return svgGrid;
  }

  initializeForce() {
  	return d3.layout.force()
      .linkDistance(90)
      .size([width, height]);
  }

  loadData() {
    var self = this;
  	d3.json('data/well_connected.json', function(json) {
		  self.nodes = json.nodes
		  self.links = json.links
		  self.hulls = []

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

      self.force
		    .gravity(.25)
		    .charge(-1 * Math.max(Math.pow(json.nodes.length, 2), 750))
		    .friction(json.nodes.length < 15 ? .75 : .65)
		    .alpha(.8)
		    .nodes(self.nodes)
		    .links(self.links);

		  // Create selectors
		  self.hull = self.container.append('g').selectAll('.hull')  
		  self.link = self.container.append('g').selectAll('.link');
		  self.node = self.container.append('g').selectAll('.node');

		  // Updates nodes and links according to current data
		  self.update();

		  self.force.on('tick', self.ticked);
		  // Avoid initial chaos and skip the wait for graph to drift back onscreen
		  for (let i = 750; i > 0; --i) self.force.tick();

		});
  }


 	update(){
	  this.link = this.link.data(this.links, function(d) { return d.id; }); //resetting the key is important because otherwise it maps the new data to the old data in order
	  this.link
	    .enter().append('line')
	    .attr('class', 'link')
	    .style('stroke-dasharray', function(d) { return d.type === 'possibly_same_as' ? ('3,3') : false; })
	    .on('mouseover', this.mouseoverLink);

    this.link.exit().remove(); 

    this.node = this.node.data(this.nodes, function(d){ return d.id; });
	  this.nodeEnter = this.node.enter().append('g')
      .attr('class', 'node')
      .attr('dragfix', false)
      .attr('dragselect', false)
      .on('click', this.clicked)
      .on('dblclick', this.dblclicked)
      .on('mouseover', this.mouseover)
      .on('mouseout', this.mouseout)
      .classed('fixed', function(d){ return d.fixed; })
      .call(this.force.drag()
        .origin(function(d) { return d; })
        .on('dragstart', this.dragstart)
        .on('drag', this.dragging)
        .on('dragend', this.dragend)
      );

    this.nodeEnter.append('circle')
      .attr('r', '20');  

    this.nodeEnter.append('text')
	    .attr('class', 'icon')
	    .attr('text-anchor', 'middle')
	    .attr('dominant-baseline', 'central')
	    .attr('font-family', 'FontAwesome')
	    .attr('font-size', '20px')
	    .text(function(d) { return (d.type && icons[d.type]) ? icons[d.type] : ''; });

    this.nodeEnter.append('text')
	    .attr('class', 'node-name')
	    .attr('dx', 25)
	    .attr('dy', '.45em')
	    .text(function(d) { return processNodeName(d.name, this.printFull)})
	    .on('click', this.clickedText)
	    .on('mouseover', this.mouseoverText)
	    .on('mouseout', this.mouseoutText)
	    .call(d3.behavior.drag()
	      .on('dragstart', this.dragstartText)
	      .on('dragstart', this.draggingText)
	      .on('dragstart', this.dragendText)
	    );

    this.node.exit().remove();

	  this.hull = this.hull.data(this.hulls)

	  this.hull
	    .enter().append('path')
	    .attr('class', 'hull')
	    .attr('d', this.drawHull)
	    .on('dblclick', function(d) {
	      this.toggleGroupView(d.groupId);
	      d3.event.stopPropagation();
	    })
    this.hull.exit().remove();

	  this.force.start();
	  this.reloadNeighbors(); // TODO: revisit this and figure out WHY d.source.index --> d.source if this is moved one line up  
	}

	// Occurs each tick of simulation
	ticked(e) {
	  this.force.resume();
	  if (!this.hull.empty()) {
	    this.calculateAllHulls()
	    this.hull.data(this.hulls)
	      .attr('d', this.drawHull)  
	  }
	  this.node
	    .each(this.groupNodesForce(.3))
	    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

    this.link.attr('x1', function(d) { return d.source.x; })
	      .attr('y1', function(d) { return d.source.y; })
	      .attr('x2', function(d) { return d.target.x; })
	      .attr('y2', function(d) { return d.target.y; });
	}

	groupNodesForce(alpha){
	  /* custom force that takes the parent group position as the centroid and moves all the nodes near */
	  return function(d){
	    if (d.group) {
	      d.y += (d.cy - d.y) * alpha;
	      d.x += (d.cx - d.x) * alpha;
	    }
	  }
	}

  // Click-drag node selection
  brushstart() {
    this.isBrushing = true;
  }

  brushing() {
    if (isRightClick()) {
      const extent = this.brush.extent();
      this.svg.selectAll('.node')
        .classed('selected', function (d) {
          const xPos = brushX.invert(d.x * this.zoomScale + this.zoomTranslate[0]);
          const yPos = brushY.invert(d.y * this.zoomScale + this.zoomTranslate[1]);
          const selected = (extent[0][0] <= xPos && xPos <= extent[1][0]
                    && extent[0][1] <= yPos && yPos <= extent[1][1])
                    || (this.classList.contains('selected') && d3.event.sourceEvent.ctrlKey);
          this.nodeSelection[d.index] = selected;
          return selected;
        });

      highlightLinksFromAllNodes();
    }
  }
  brushend() {
    this.brush.clear();
    this.svg.selectAll('.brush').call(this.brush);
    this.isBrushing = false;
  }

  // Single-node interactions
  clicked(d, i) {
    if (d3.event.defaultPrevented) return;
    const node = d3.select(this);
    const fixed = !(node.attr('dragfix') == 'true');
    node.classed('fixed', d.fixed = fixed);
    this.force.resume();
    d3.event.stopPropagation();
  }

  rightclicked(node, d) {
    const fixed = node.attr('dragfix') == 'true';
    const selected = !(node.attr('dragselect') == 'true');
    node.classed('fixed', d.fixed = fixed)
        .classed('selected', this.nodeSelection[d.index] = selected);
    highlightLinksFromNode(node[0]);
    this.force.resume();
  }

  dblclicked(d) {
    if (this.groups[d.id]) {
      this.toggleGroupView(d.id);
    }

    d3.event.stopPropagation();
  }

  // Click helper
  isRightClick() {
    return (d3.event && (d3.event.which == 3 || d3.event.button == 2))
        || (d3.event.sourceEvent && (d3.event.sourceEvent.which == 3 || d3.event.sourceEvent.button == 2));
  }

  // Click-drag node interactions
  dragstart(d) {
    d3.event.sourceEvent.preventDefault();
    d3.event.sourceEvent.stopPropagation();
    if (this.isEmphasized) resetGraphOpacity();

    this.isDragging = true;
    displayNodeInfo(d);
    const node = d3.select(this);
    node
      .attr('dragfix', node.classed('fixed'))
      .attr('dragselect', node.classed('selected'))
      .attr('dragdistance', 0);

    node.classed('fixed', d.fixed = true); 
    if (isRightClick()) {
      node.classed('selected', this.nodeSelection[d.index] = true);
      highlightLinksFromNode(node[0]);
    }
  } 

	dragging(d) {
	  const node = d3.select(this);
	  node
	    .attr('cx', d.x = d3.event.x)
	    .attr('cy', d.y = d3.event.y)
	    .attr('dragdistance', parseInt(node.attr('dragdistance')) + 1);
  }

	dragend(d) {
	  const node = d3.select(this);
	  if (!this.parseInt(node.attr('dragdistance')) && this.isRightClick()) {
	    this.rightclicked(node, d);
	  }

	  this.isDragging = false;
	  this.force.resume();
	}

	// Node emphasis
	mouseover(d) {
    var self = this;
	  if (!this.isDragging && !this.isBrushing) {
	    this.isEmphasized = true;
	    this.node
	      .filter(function(o) {
	        return !self.neighbors(d, o);
	      })
	      .style('stroke-opacity', .15)
	      .style('fill-opacity', .15);
	    // .select('.node-name')
	    //   .text(function(d) { return processNodeName(d.name, 1); });

	    this.link.style('stroke-opacity', function(o) {
	      return (o.source == d || o.target == d) ? 1 : .05;
      });
      debugger
	    if (this.printFull == 0) d3.select(this).select('.node-name').text(processNodeName(d.name, 2));
	  }
	}

	mouseout(d) {
    this.resetGraphOpacity();
    var self = this;
	  if (this.printFull != 1) d3.select(this).select('.node-name').text(function(d) { return processNodeName(d.name, self.printFull); });
	}

	// Zoom & pan
	zoomstart() {
	  const e = d3.event;
	  if (isRightClick()) {
	    this.zoomTranslate = this.zoom.translate();
	    this.zoomScale = this.zoom.scale();
	  }
	}

	zooming() {
	  if (!isRightClick()) {
	    const e = d3.event;
	    const transform = 'translate(' + (((e.translate[0]/e.scale) % gridLength) - e.translate[0]/e.scale)
	      + ',' + (((e.translate[1]/e.scale) % gridLength) - e.translate[1]/e.scale) + ')scale(' + 1 + ')';
	    this.svgGrid.attr('transform', transform);
	    this.container.attr('transform', 'translate(' + e.translate + ')scale(' + e.scale + ')');
	  }
	}

	zoomend() {
	  this.svg.attr('cursor', 'move');
	  if (isRightClick()) {
	    this.zoom.translate(zoomTranslate);
	    this.zoom.scale(zoomScale);
	  }

	  zoomTranslate = zoom.translate();
	  zoomScale = zoom.scale();
	} 

	// Link mouse handlers
	mouseoverLink(d) {
	  displayLinkInfo(d);
	}

	// Node text mouse handlers
	clickedText(d, i) {
	  d3.event.stopPropagation();
	}

	dragstartText(d) {
	  d3.event.sourceEvent.stopPropagation();
	}

	draggingText(d) {
	  d3.event.sourceEvent.stopPropagation();
	}

	dragendText(d) {
	  d3.event.sourceEvent.stopPropagation();
	}

	mouseoverText(d) {
	  if (this.printFull == 0 && !this.isBrushing && !this.isDragging) {
	    d3.select(this).text(processNodeName(d.name, 2));
	  }

	  d3.event.stopPropagation();
	}

	mouseoutText(d) {
	  if (this.printFull == 0 && !this.isBrushing && !this.isDragging) {
	    d3.select(this).text(processNodeName(d.name, 0));
	  }

	  d3.event.stopPropagation();
	}

  // Graph manipulation keycodes
  setupKeycodes() {
    d3.select('body')
      .on('keydown', function() {
        // u: Unpin selected nodes
        if (d3.event.keyCode == 85) {
          this.svg.selectAll('.node.selected')
            .each(function(d) { d.fixed = false; })
            .classed('fixed', false);
        }

        // e: Remove links
        else if (d3.event.keyCode == 69) {
          deleteSelectedLinks();
        }

        // g: Group selected nodes
        else if (d3.event.keyCode == 71) {
          groupSelectedNodes();
        }

        // h: Ungroup selected nodes
        else if (d3.event.keyCode == 72) {
          ungroupSelectedGroups();
        }

        // r: Remove selected nodes
        else if (d3.event.keyCode == 82 || d3.event.keyCode == 46) {
          deleteSelectedNodes();
        }

        // a: Add node linked to selected
        else if (d3.event.keyCode == 65) {
          addNodeToSelected();
        }

        // d: Hide document nodes
        else if (d3.event.keyCode == 68) {
          toggleDocumentView();
        }

        // p: Toggle btwn full/abbrev text
        else if (d3.event.keyCode == 80) {
          this.printFull = (this.printFull + 1) % 3;
          selectAllNodeNames().text(function(d) { return processNodeName(d.name, this.printFull); });
        }

        this.force.resume()
      });
    }

	// Link highlighting
	highlightLinksFromAllNodes() {
	  this.svg.selectAll('.link')
	    .classed('selected', function(d, i) {
	      return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index];
	    });
	}

	highlightLinksFromNode(node) {
	  node = node[0].__data__.index;
	  this.svg.selectAll('.link')
	    .filter(function(d, i) {
	      return d.source.index == node || d.target.index == node;
	    })
	    .classed('selected', function(d, i) {
	      return this.nodeSelection[d.source.index] && this.nodeSelection[d.target.index];
	    });
	}

	// Multi-node manipulation methods
	deleteSelectedNodes() {
	  /* remove selected nodes from DOM
	      if the node is a group, delete the group */
	  var groupIds = Object.keys(this.groups);
	  var select = this.svg.selectAll('.node.selected');
	  let group;

	  var removedNodes = removeNodesFromDOM(select);
	  var removedLinks = removeNodeLinksFromDOM(removedNodes);

	  removedLinks.map((link)=> { //remove links from their corresponding group
	    if (link.target.group) {
	      group = this.groups[link.target.group];
	      group.links.splice(group.links.indexOf(link), 1);
	    } if (link.source.group) {
	      group = this.groups[link.source.group];
	      group.links.splice(group.links.indexOf(link), 1);
	    }
	  });

	  removedNodes.map((node) => {// remove nodes from their corresponding group & if the node is a group delete the group
	    if (isInArray(node.id, groupIds)) {
	      delete this.groups[node.id];
	    }
	    if (node.group) {
	      group = this.groups[node.group];
	      group.nodes.splice(group.nodes.indexOf(node), 1);
	    }
	  });

	  this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
	  update();
	}

  // Delete selected links
  deleteSelectedLinks() {
    /* remove selected nodes from DOM
        if the node is a group, delete the group */
    var groupIds = Object.keys(this.groups);
    var select = this.svg.selectAll('.node.selected');
    let group;

    var removedLinks = removeNodeLinksSelectiveFromDOM(select);

    removedLinks.map((link)=> { //remove links from their corresponding group
      if (link.target.group) {
        group = this.groups[link.target.group];
        group.links.splice(group.links.indexOf(link), 1);
      } if (link.source.group) {
        group = this.groups[link.source.group];
        group.links.splice(group.links.indexOf(link), 1);
      }
    });

    this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
    this.node.classed("selected", false)
    this.update();
  }

  addNodeToSelected(){
    /* create a new node using the globalnodeid counter
      for each node selected, create a link attaching the new node to the selected node
      remove highlighting of all nodes and links */
    const nodeid = this.globalnodeid;
    const newnode = {id: nodeid, name: `Node ${-1*nodeid}`, type: "Custom"};
    var select = this.svg.selectAll('.node.selected');
    if (select[0].length === 0) { return; } //if nothing is selected, don't add a node for now because it flies away

    this.globalnodeid -= 1;
    this.nodes.push(newnode);

    select
      .each((d) => {
        this.links.push({id: this.globallinkid, source: this.nodes.length-1, target: this.nodes.indexOf(d), type: "Custom"});
        this.globallinkid -= 1;
      })

    this.node.classed("selected", false);
    this.link.classed("selected", false);
    this.nodeSelection = {};
    this.update();
  }

  toggleDocumentView() {
    if (this.hidden.links.length === 0 && this.hidden.nodes.length ===0) { //nothing is hidden, hide them
      hideDocumentNodes();
    } else {
      showHiddenNodes();
    }
    this.update();
  }

  hideDocumentNodes() {
    var select = svg.selectAll('.node')
      .filter((d) => {
        if (d.type === "Document") { return d; }
      })

    hideNodes(select);
  }

  hideNodes(select) {
    /* remove nodes
        remove links attached to the nodes
        push all the removed nodes & links to the global list of hidden nodes and links */

    const removedNodes = removeNodesFromDOM(select);
    const removedLinks = removeNodeLinksFromDOM(removedNodes);
    removedNodes.map((node)=> {
      this.hidden.nodes.push(node)
    });
    removedLinks.map((link)=>{
      this.hidden.links.push(link)
    });
  }

  showHiddenNodes() {
    /* add all hidden nodes and links back to the DOM display */

    this.hidden.nodes.slice().map((node) => { nodes.push(node); });
    this.hidden.links.slice().map((link)=> { links.push(link); });

    this.hidden.links =[];
    this.hidden.nodes = [];
  }

  groupSelectedNodes() {
  /* turn selected nodes into a new group, then delete the selected nodes and 
    move links that attached to selected nodes to link to the node of the new group instead */
    var select = svg.selectAll('.node.selected');

    if (select[0].length <= 1) { return; } //do nothing if nothing is selected & if there's one node

    const group = createGroupFromSelect(select);
    const removedNodes = removeNodesFromDOM(select);
    nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: "group"}); //add the new node for the group
    moveLinksFromOldNodesToGroup(removedNodes, group);

    select.each((d)=> { delete this.groups[d.id]; });
      // delete any groups that were selected AFTER all nodes & links are deleted
      // and properly inserted into the global variable entry for the new group

    this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
    this.update();
    fillGroupNodes();
    displayGroupInfo(groups);
  }

  ungroupSelectedGroups() {
    /* expand nodes and links in the selected groups, then delete the group from the global groups dict */
    var select = svg.selectAll('.node.selected')
      .filter((d)=>{
        if (this.groups[d.id]){ return d; }
      });

    const newNodes = expandGroups(select, centered=false);
    newNodes.map((node) => { node.group=null }); //these nodes no longer have a group
    select.each((d) => { delete this.groups[d.id]; }); //delete this group from the global groups 

    this.nodeSelection = {}; //reset to an empty dictionary because items have been removed, and now nothing is selected
    this.node.classed("selected", false)
    this.update();
    displayGroupInfo(groups);
  }

  expandGroup(groupId) {
    /* expand the group of the groupId passed in*/
    var select = this.svg.selectAll('.node')
      .filter((d) => {
        if (d.id === groupId && this.groups[d.id]) { return d; }
      });

    expandGroups(select, centered=true);
  }

  expandGroups(select, centered=false) {
    /* bring nodes and links from a group back to the DOM, with optional centering around the node of the group's last position */
    var newNodes = [];
    select
      .each((d) => {
        const group = this.groups[d.id];
        if (group) {
          group.nodes.map((node) => {
            if (centered) {
              group.fixedX = d.x; //store the coordinates of the group node
              group.fixedY = d.y;
              const offset = .5*45* Math.sqrt(group.nodes.length); // math to make the total area of the hull equal to 15*15 per node
              const xboundlower = group.fixedX - offset;
              const yboundlower = group.fixedY - offset;

              node.x = node.px = Math.floor(Math.random() * offset * 2) + xboundlower;
              node.y = node.py = Math.floor(Math.random() * offset * 2) + yboundlower; 
              node.cx = group.fixedX;
              node.cy = group.fixedY;
              //node.fixed = true;  
            }
            newNodes.push(node);
            this.nodes.push(node); //add all nodes in the group to global nodes
          });
          group.links.map((link) => {
            this.links.push(link); //add all links in the group to global links
          });
        }
      });

    const removedNodes = removeNodesFromDOM(select);
    removeNodeLinksFromDOM(removedNodes);
    return newNodes;
  }

  collapseGroupNodes(groupId) {
    /* collapse nodes in a group into a single node representing the group */
    const group = this.groups[groupId];
    const groupNodeIds = group.nodes.map((node) => { return node.id; });

    var select = svg.selectAll('.node')
      .filter((d) => {
        if (isInArray(d.id, groupNodeIds)) { return d; }
      });

    const removedNodes = removeNodesFromDOM(select);
    this.nodes.push({id: group.id, name: `Group ${-1*group.id}`, type: 'group'}); //add the new node for the group
    moveLinksFromOldNodesToGroup(removedNodes, group);
  }

  toggleGroupView(groupId) {
    /* switch between viewing the group in expanded and collapsed state.
      When expanded, the nodes in the group will have a hull polygon encircling it */
    const group = this.groups[groupId];

    if (!group) {
      console.log("error, the group doesn't exist even when it should: ", groupId);
    }

    if (expandedGroups[groupId]) {
      collapseGroupNodes(groupId);
      this.hulls.map((hull, i) => {
        if (hull.groupId === groupId) {
          hulls.splice(i, 1); // remove this hull from the global list of hulls
        }
      })
      expandedGroups[groupId] = false;
    } else {
      expandGroup(groupId);
      this.hulls.push(createHull(group));
      expandedGroups[groupId] = true;
    }

    this.update();
    fillGroupNodes();
  }

  //Hull functions
  createHull(group) {
    var vertices = [];
    var offset = 20; //arbitrary, the size of the node radius
    group.nodes.map(function(d) {
      vertices.push(
        [d.x + offset, d.y + offset], // creates a buffer around the nodes so the hull is larger
        [d.x - offset, d.y + offset], 
        [d.x - offset, d.y - offset], 
        [d.x + offset, d.y - offset]
      );
    });

    return {groupId: group.id, path: d3.geom.hull(vertices)}; //returns a hull object
  }

  calculateAllHulls() {
    /* calculates paths of all hulls in the global hulls list */
    this.hulls.map((hull, i) => {
      this.hulls[i] = createHull(this.groups[hull.groupId]);
    });
  }

  drawHull(d) {
    return this.curve(d.path);
  }

// =================
// SELECTION METHODS
// =================

  // Get all node text elements
  selectAllNodeNames() {
    return d3.selectAll('text')
      .filter(function(d) { return d3.select(this).classed('node-name'); });
  }



  // Determine if neighboring nodes
  neighbors(a, b) {
    return this.linkedByIndex[a.index + ',' + b.index] 
        || this.linkedByIndex[b.index + ',' + a.index]  
        || a.index == b.index;
  }

  reloadNeighbors() {
    this.linkedByIndex = {};
    var self = this;
    this.links.forEach(function(d) {
      self.linkedByIndex[d.source.index + "," + d.target.index] = true;
    });
  }

  removeLink(removedNodes, link) {
    /* takes in a list of removed nodes and the link to be removed
        if the one of the nodes in the link target or source has actually been removed, remove the link and return it
        if not, then don't remove */
    let removedLink;
    //only remove a link if it's attached to a removed node
    if(removedNodes[link.source.id] === true || removedNodes[link.target.id] === true) { //remove all links connected to a node to remove
      const index = this.links.indexOf(link);
      removedLink = this.links.splice(index, 1)[0];
    }

    return removedLink;
  }

  removeSelectiveLink(nodesSelected, link) {
    /* takes in a list of removed nodes and the link to be removed
        if both of the nodes in the link target or source are in the list, remove the link and return it
        if not, then don't remove */
    let removedLink;
    if(nodesSelected[link.source.id] === true && nodesSelected[link.target.id] === true) { //remove all links connected to both nodes to remove
      const index = this.links.indexOf(link);
      removedLink = this.links.splice(index, 1)[0];
    }

    return removedLink;
  }

  reattachLink(link, newNodeId, removedNodes, nodeIdsToIndex) {
    /* takes in a link, id of the new nodes, and a dict mapping ids of removed nodes to state
        depending on whether the link source or target will be newNodeId,
        create a new link with appropriate source/target mapping to index of the node
        if neither the source nor target were in removedNodes, do nothing */
    let linkid = this.globallinkid;
    if (removedNodes[link.source.id] === true && removedNodes[link.target.id] !== true) {
      //add new links with appropriate connection to the new group node
      //source and target refer to the index of the node
      this.links.push({id: linkid, source: nodeIdsToIndex[newNodeId], target: nodeIdsToIndex[link.target.id], type: 'multiple'});
      this.globallinkid -= 1;
    } else if (removedNodes[link.source.id] !== true && removedNodes[link.target.id] === true) {
      this.links.push({id: linkid, source: nodeIdsToIndex[link.source.id], target: nodeIdsToIndex[newNodeId], type: 'multiple'});
      this.globallinkid -=1;
    }
  }

  moveLinksFromOldNodesToGroup(removedNodes, group, ) {
    /* takes in an array of removedNodes and a group
      removes links attached to these nodes
      if the removed link was already attached to a group, don't add that link to the group's list of links 
      (because we're not adding that node to the group's list of nodes)
      if else, add that link to the group's list of links
      then reattach the link */
    const removedNodesDict = {};
    const nodeIdsToIndex = {};
    const existingLinks = {};

    removedNodes.map((node) => {
      removedNodesDict[node.id] = true;
    });

    this.nodes.map((node, i) => {
      nodeIdsToIndex[node.id] = i; //map all nodeIds to their new index
    });
    group.links.map((link)=>{
      existingLinks[link.target.id + ',' + link.source.id] = true;
    })

    this.links.slice().map((link) => {
      const removedLink = removeLink(removedNodesDict, link);
      if (removedLink) {
        const groupids = Object.keys(groups).map((key) => { return parseInt(key); });
        if (isInArray(link.target.id, groupids) || isInArray(link.source.id, groupids)) {
          // do nothing if the removed link was attached to a group
        } else if (existingLinks[link.target.id + ',' + link.source.id]) {
          //do nothing if the link already exists in the group, i.e. if you're expanding
        } else {
          group.links.push(removedLink);
        }
        reattachLink(link, group.id, removedNodesDict, nodeIdsToIndex);
      }
    });
  }

  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }

  removeNodesFromDOM(select) {
    /* iterates through a select to remove each node, and returns an array of removed nodes */

    const removedNodes = []
    select
      .each((d) => {
        if (this.nodes.indexOf(d) === -1) {
          console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", nodes);
        } else {
          removedNodes.push(d);
          this.nodes.splice(nodes.indexOf(d),1);
        }
      });

    return removedNodes
  }

  removeNodeLinksFromDOM(removedNodes) {
    /* takes in an array of nodes and removes links associated with any of them
        returns an arry of removed links */

    const removedLinks = [];
    let removedLink;
    const removedNodesDict = {};

    removedNodes.map((node) => {
      removedNodesDict[node.id] = true;
    })

    this.links.slice().map((link) => {
      removedLink = removeLink(removedNodesDict, link);
      if (removedLink) {
        removedLinks.push(removedLink);
      }
    });

    return removedLinks;
  }

  removeNodeLinksSelectiveFromDOM(select) {
    /* iterates through select to gather list of nodes selected, and removes
        link if both of its endpoint nodes are selected */

    const nodesSelected = []
    select
      .each((d) => {
        if (this.nodes.indexOf(d) === -1) {
          console.log("Error, wasn't in there and node is: ", d, " and nodes is: ", this.nodes);
        } else {
          nodesSelected.push(d);
        }
      });

    const removedLinks = [];
    let removedLink;
    const nodesDict = {};

    nodesSelected.map((node) => {
      nodesDict[node.id] = true;
    })

    this.links.slice().map((link) => {
      removedLink = removeSelectiveLink(nodesDict, link);
      if (removedLink) {
        removedLinks.push(removedLink);
      }
    });

    return removedLinks;
  }

  createGroupFromSelect(select){
    /* iterates through the items in select to create a new group with proper links and nodes stored.
        if a node in the select is already a group, takes the nodes and links from that group and puts it in
        the new group */

    const groupId = this.globalnodeid;
    const group = this.groups[groupId] = {links: [], nodes: [], id: groupId}; //initialize empty array to hold the nodes
    
    select
      .each((d) => {
        if (this.groups[d.id]) { //this node is already a group
          var newNodes = groups[d.id].nodes;
          var newLinks = groups[d.id].links;
          newNodes.map((node) => {
            group.nodes.push(node); //add each of the nodes in the old group to the list of nodes in the new group        
          });
          newLinks.map((link) => {
            group.links.push(link); //add all the links inside the old group to the new group
          });
        } else {
          d.group = groupId;
          group.nodes.push(d); //add this node to the list of nodes in the group
        }
      }); 

      this.globalnodeid -=1;
    return group;
  }

// Fill group nodes blue
  fillGroupNodes() {
    svg.selectAll('.node')
      .classed('grouped', function(d) { return d.id < 0; });
  }

// Reset all node/link opacities to 1
  resetGraphOpacity() {
    this.isEmphasized = false;
    this.node.style('stroke-opacity', 1)
        .style('fill-opacity', 1);
    this.link.style('stroke-opacity', 1);
  }




}

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

// Normalize node text to same casing conventions and length
// printFull states - 0: abbrev, 1: none, 2: full
function processNodeName(str, printFull) {
  if (!str || printFull == 1) {
    return '';
  }

  // Length truncation
  str = str.trim();
  if (str.length > maxTextLength && printFull == 0) {
    str = `${str.slice(0, maxTextLength).trim()}...`;
  }

  // Capitalization
  const delims = [' ', '.', '('];
  for (let i = 0; i < delims.length; i++) {
    str = splitAndCapitalize(str, delims[i]);
  }

  return str;
}

function splitAndCapitalize(str, splitChar) {
  let tokens = str.split(splitChar);
  tokens = tokens.map(function(token, idx) {
    return capitalize(token, splitChar == ' ');
  });

  return tokens.join(splitChar);
}

function capitalize(str, first) {
  return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
}
const graph = new Graph();
// export default Graph;
