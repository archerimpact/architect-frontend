import React, { Component } from 'react';
import './App.css';
import * as d3 from 'd3'


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

class NodeGraph extends Component {

	constructor(props){
		super(props);
		this.state = {
			linkNodes: this.entitiesToLinks(this.props.savedEntities.entities),
			dataNodes: this.entitiesToNodes(this.props.savedEntities.entities)
		}
	}

	chipsToLinks(entity) {

		return entity.chips.map((chip) => {
			return {"source": entity.name, "target": chip}
		})
	}

	entitiesToLinks(entities) {
		return [].concat.apply([], entities.map((entity) => {
			return this.chipsToLinks(entity);
		}))
	}

	entitiesToNodes(entities) {
		return entities.map((entity) => {
			return {"id": entity.name, "name": entity.name, "type": entity.type}

		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			linkNodes: this.entitiesToLinks(nextProps.savedEntities.entities), 
			dataNodes: this.entitiesToNodes(nextProps.savedEntities.entities)
		})
		debugger

	}

	componentDidMount = () => {
		const dataNodes = this.state.dataNodes


		console.log(dataNodes)
		const linkNodes = this.state.linkNodes
		console.log(linkNodes)
		let height = document.body.clientHeight;
		let width = document.body.clientWidth;

		const data = {
			"nodes": dataNodes,
			"links": linkNodes
		};


		function getNodeColor(node) {
			if (node.type === "Person") {
				return "#FF0000"
			}
			if (node.type === "Company") {
				return "#add8e6" 
			}
		}

		const simulation = d3.forceSimulation(data.nodes)
			.force("center", d3.forceCenter(100, 300))
    		.force("charge", d3.forceManyBody())
    		.force("link", d3.forceLink().id(function(d) { return d.id; }));

		const svg = d3.select(this.refs.mountPoint)
			.append('svg')
			.attr('width', "800px")
			.attr('height', "500px")
			.attr('display', "block")
			.attr('margin', "auto");

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
			.style('fill', (d) => getNodeColor(d));

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

	render() {
		return (
			<div>
				<div ref="mountPoint" />
			</div>

			)
	}
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        entityTypes: state.data.entityTypes,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodeGraph)