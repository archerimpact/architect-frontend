import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3'

class NodeGraph extends Component {

	//takes in a list of entities and maps it to a list of nodes for the d3 simulation
	entitiesToNodes(entities) {
		return entities.map((entity) => {
			return {"id": entity.name, "name": entity.name, "type": entity.type}
		});
	};

	//takes all of the tags of one entity and returns an array of all the links of that one entity
	tagsToLinks(entity) {
		return entity.chips.map((chip) => {
			return {"source": entity.name, "target": chip}
		});
	};

	//iterates over all the entities and builds an array of all the links for the d3 simulation
	entitiesToLinks(entities) {
		return [].concat.apply([], entities.map((entity) => {
			return this.tagsToLinks(entity);
		}));
	};

	//returns the color of the node based on the type of the entity
	getNodeColor(node) {
		if (node.type === "Person") {
			return "#4FFFB3"
		}
		if (node.type === "Company") {
			return "#4276FF" 
		}
		if (node.type === "Location") {
			return "#3CCCE8"
		}
	}

	//the entire logic for generating a d3 forceSimulation graph
	generateNetworkCanvas(entities) {
		const dataNodes = this.entitiesToNodes(entities)
		const linkNodes = this.entitiesToLinks(entities)

		const data = {
			"nodes": dataNodes,
			"links": linkNodes
		};

		const width = 500;
		const height = 500;

		const simulation = d3.forceSimulation(data.nodes)
			.force("center", d3.forceCenter(width/3, height/2))
    		.force("charge", d3.forceManyBody())
    		.force("link", d3.forceLink().distance(50).id(function(d) { return d.id; }));

		const svg = d3.select(this.refs.mountPoint)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('display', "block")
			.attr('margin', "auto")
			.attr('id', 'svg1')

		const linkElements = svg.selectAll('line')
			.data(data.links)
			.enter()
			.append('line')
			.style('stroke', '#999999')
			.style('stroke-opacty', 0.6)
			.style('stroke-width', 1.5);


		const nodeElements = svg.selectAll('circle')
			.data(data.nodes)
			.enter()
			.append('g')
			.style('cursor', 'pointer')

		nodeElements.append('circle')
			.attr('r',10)
			.style('stroke', '#999999')
			.style('stroke-width', 1.5)
			.style('fill', (d) => this.getNodeColor(d));

		/* The following is a function for making the graph draggable. Still a work in progress.
		svg.selectAll('circle').call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))
		*/


		nodeElements.append('text')
			.style("font-size", "12px")
			.text((d) => d.name + ": " + d.type)

		simulation.on('tick', () => {
			var movement = 0;
			linkElements
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);
			nodeElements
				.attr('transform', (d) => {return 'translate(' + d.x + movement + ',' + d.y + movement + ')'});
		})	
		simulation.force("link").links(data.links)

		/* The following is the functions for making the graph draggable. Still a work in progress.
		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  				d.fx = d.x;
  				d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
  			d.fy = d3.event.y;
		}

		function dragended(d) {
  			if (!d3.event.active) simulation.alphaTarget(0);
  				d.fx = null;
 				d.fy = null;
			}

		function dragDrop() {
			d3.drag()
			.on('start', (g) => {
				g.children[0].fx = g.children[0].x
				g.children[0].fy = g.children[0].y
			})
			.on('drag', (g) => {
				simulation.alphaTarget(0.7).restart()
				g.children[0].fx = d3.event.x
				g.children[0].fy = d3.event.y
			})
			.on('end', (g) => {
				if (!d3.event.active) {
			  	simulation.alphaTarget(0)
				}
				g.children[0].fx = null
				g.children[0].fy = null
			})} */
	}
	
	//When the props update (aka when there's a new entity or relationship), delete the old graph and create a new one
	componentWillReceiveProps(nextProps) {		
		const mountPoint = d3.select('#svgdiv')
		mountPoint.selectAll("svg").remove()
		this.generateNetworkCanvas(nextProps.entities)	
	}

	//builds the first graph based on after the component mounted and mountPoint was created.
	componentDidMount = () => {
		this.generateNetworkCanvas(this.props.entities)
	}

	render() {
		return (
			<div>
				<div id="svgdiv" ref="mountPoint" />
			</div>

		)
	}
}

export default NodeGraph