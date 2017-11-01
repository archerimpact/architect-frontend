import React, { Component } from 'react';
import * as d3 from 'd3';

class NodeGraph extends Component {
/* Takes as props a list of entities and a list of sources */

	createNodes(entities, documents) {
		/* Takes in a list of entities and documents and maps it to a 
			list of nodes for the d3 simulation */

		var entityNodes = entities.map((entity) => {
			return {"id": entity.name, "name": entity.name, "type": entity.type};
		});
		var documentNodes = documents.map((document) => {
			return {"id": document._id, "name": document.title, "type": "DOCUMENT"};
		});
		return documentNodes.concat(entityNodes);
	};

	createLinks(entities, documents) {
		/* Iterates over all the entitiesa and documents and builds an 
			array of all the links for the d3 simulation */

		var documentLinks = [].concat.apply([], documents.map((document) => {
			return this.sourceToLinks(document);
		}));
		var entityLinks= [].concat.apply([], entities.map((entity) => {
			return this.tagsToLinks(entity);
		}));
		if (typeof(documentLinks) === "undefined"){
			documentLinks=[];
		};
		if (typeof(entityLinks) === "undefined"){
			entityLinks=[];
		};
		return entityLinks.concat(documentLinks);
	};

	tagsToLinks(entity) {
		/* Takes all of the tags of one entity and returns an array of all
			 the links of that one entity */

		return entity.tags.map((tag) => {
			return {"source": entity.name, "target": tag};
		});
	};

	/* TO-DO: refactor so that this method takes entities and maps a connection
		 to sources if and only if the source appears in this graph */
	sourceToLinks(document) {
		if (document.length === 0) {
			return;
		}else{
			return document.entities.map((entity) => {
				return {"source": entity.normalized, "target": document._id};
			});
		}
	};

	getNodeColor(node) {
		/* returns the color of the node based on the type of the entity */

		if (node.type === "Person" || node.type === "PERSON") {
			return "#FFB7A0";
		};
		if ( node.type === "DOCUMENT") {
			return "#3EE8D3";
		};
		if (node.type ==="ORGANIZATION" || node.type === "Company") {
			return "#FAAAFF";
		};
		if (node.type === "Location" || node.type === "LOCATION") {
			return "#5163FF";
		};
		if (node.type === "NATIONALITY") {
			return "#95FF6F";
		};
	};

  getImage(node) {
    if (node.type === "Person" || node.type === "PERSON") {
      return "https://www.materialui.co/materialIcons/social/person_grey_192x192.png";
    };
    if ( node.type === "DOCUMENT") {
      return "http://www.iconsdb.com/icons/preview/gray/document-xxl.png";
    };
    if (node.type ==="ORGANIZATION" || node.type === "Company") {
      return "https://maxcdn.icons8.com/Share/icon/dotty/Business//organization1600.png";
    };
    if (node.type === "Location" || node.type === "LOCATION") {
      return "https://d30y9cdsu7xlg0.cloudfront.net/png/12638-200.png";
    };
    if (node.type === "NATIONALITY") {
      return "https://cdn0.iconfinder.com/data/icons/buntu-trade/100/flag_glyph_convert-512.png";
    };
  }

	generateNetworkCanvas(entities, sources) {
		/* The entire logic for generating a d3 forceSimulation graph */
		if (typeof(sources[0]) === "undefined") {
			sources = [];
		};
		
		const dataNodes = this.createNodes(entities, sources);
		const linkNodes = this.createLinks(entities, sources);
		
		const data = {
			"nodes": dataNodes,
			"links": linkNodes
		};

		const width = 1000;
		const height = 700;

		const simulation = d3.forceSimulation(data.nodes)
			.force("center", d3.forceCenter(width/2, height/2))
			.force("charge", d3.forceManyBody())
			.force("link", d3.forceLink().distance(60).id(function(d) { return d.id; }));

		const svg = d3.select(this.refs.mountPoint)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('display', "block")
			.attr('margin', "auto")
			.attr('id', 'svg1')
      //.call(d3.zoom().on("zoom", redraw))

		const linkElements = svg.selectAll('line')
			.data(data.links)
			.enter()
			.append('line')
			.style('stroke', '#999999')
			.style('stroke-opacty', 0.6)
			.style('stroke-width', 2.0);

		const nodeElements = svg.selectAll('circle')
			.data(data.nodes)
			.enter()
			.append('g')
			.style('cursor', 'pointer');

    nodeElements.append('circle')
			.attr('r',7)
			.style('stroke', '#FFFFFF')
			.style('stroke-width', 1.5)
			.style('fill', (d) => this.getNodeColor(d));

    nodeElements.append('image')
      .attr("xlink:href", (d) => this.getImage(d))
      .attr("height", 20)
      .attr("width", 20);
    
		svg.selectAll('g').call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

		nodeElements.append('text')
			.style("font-size", "12px")
			.text((d) => d.name);

		simulation.on('tick', () => {
			linkElements
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);
			nodeElements
				.attr('transform', (d) => {return 'translate(' + d.x + ',' + d.y + ')'});
		});

		simulation.force("link").links(data.links);

		function dragstarted(d) {
			if (!d3.event.active) {
				simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			};
		};

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		};

		function dragended(d) {
			if (!d3.event.active) {
				simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			};
		};

    function redraw() {
      svg.attr("transform", d3.event.transform);
    }
	};

  componentWillReceiveProps(nextProps) {		
		/* When the props update (aka when there's a new entity or relationship), 
			delete the old graph and create a new one */

		const mountPoint = d3.select('#svgdiv');
		mountPoint.selectAll("svg").remove();
		this.generateNetworkCanvas(nextProps.entities, nextProps.sources);
	};

	componentDidMount = () => {
		/* builds the first graph based on after the component mounted and mountPoint was created. */

		this.generateNetworkCanvas(this.props.entities, this.props.sources);
	};

	render() {
		return (
			<div>
				<div id="svgdiv" ref="mountPoint" />
			</div>
		);
	};
}

export default NodeGraph;