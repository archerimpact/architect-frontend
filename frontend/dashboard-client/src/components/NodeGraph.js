import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3'

class NodeGraph extends Component {

	constructor(props){
		super(props);
		
	}

	entitiesToNodes(entities) {
		return entities.map((entity) => {
			return {"id": entity.name, "name": entity.name, "type": entity.type}

		});
	}

	tagsToLinks(entity) {
		return entity.chips.map((chip) => {
			return {"source": entity.name, "target": chip}
		})
	}

	entitiesToLinks(entities) {
		return [].concat.apply([], entities.map((entity) => {
			return this.tagsToLinks(entity);
		}))
	}

	getNodeColor(node) {
		if (node.type === "Person") {
			return "#FF0000"
		}
		if (node.type === "Company") {
			return "#add8e6" 
		}
	}

	generateNetworkCanvas(entities) {
		const dataNodes = this.entitiesToNodes(entities)
		console.log(dataNodes)
		const linkNodes = this.entitiesToLinks(entities)
		console.log(linkNodes)

		const data = {
			"nodes": dataNodes,
			"links": linkNodes
		};

		const width = 500;
		const height = 500;

		const simulation = d3.forceSimulation(data.nodes)
			.force("center", d3.forceCenter(width/3, height/2))
    		.force("charge", d3.forceManyBody().strength(-400))
    		.force("link", d3.forceLink().id(function(d) { return d.id; }));

		const svg = d3.select(this.refs.mountPoint)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.attr('display', "block")
			.attr('margin', "auto")
			.attr('id', 'svg1');

		const linkElements = svg.selectAll('line')
			.data(data.links)
			.enter()
			.append('line')
			.style('stroke', '#999999')
			.style('stroke-opacty', 0.6)
			.style('stroke-width', 1.5);

		const color = '#443030';

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

		nodeElements.append('text')
			.style("font-size", "12px")
			.text((d) => d.name + ": " + d.type);	

		simulation.on('tick', () => {
			var movement = 400;
			linkElements
				.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);
			nodeElements
				.attr('transform', (d) => {return 'translate(' + d.x + movement + ',' + d.y + movement + ')'});
		})	
		simulation.force("link").links(data.links)

		const dragDrop = d3.drag()
			.on('start', (g) => {
				debugger
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
			})
		nodeElements.call(dragDrop)
	}
	

	componentWillReceiveProps(nextProps) {
		
		const mountPoint = d3.select('#svgdiv')
		mountPoint.selectAll("svg").remove()

		this.generateNetworkCanvas(nextProps.entities)
		
	}



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