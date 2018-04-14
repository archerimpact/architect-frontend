import React, { Component } from 'react';
import './graph.css'
import Graph from './Graph';


const height = window.innerHeight,
    width = Math.max(window.innerWidth - 500);

class NodeGraph extends Component {
    /* Takes as props a list of nodes and a list of entities */
    constructor(props) {
        super(props);
        this.state = {
            text: true,
            graph: new Graph()
        };
        // this.graph.generateNetworkCanvas(centerid, props.nodes, props.links);
    }

    // updateGraph(centerid, inputnodes, inputlinks, text) {
    //     // const mountPoint = d3.select('#graph-container');
    //     // mountPoint.selectAll("svg").remove(); // TO-DO: implement updating of the graph to add/remove nodes instead of removing the SVG
    //     this.generateNetworkCanvas(centerid, inputnodes, inputlinks);
    // }

    // componentWillReceiveProps(nextProps) {
    //     /* When the props update (aka when there's a new entity or relationship), 
    //         delete the old graph and create a new one */
    //     this.state.graph.updateGraph(nextProps.centerid, nextProps.nodes, nextProps.links);
    // };

    componentDidMount() {
        this.state.graph.generateNetworkCanvas(this.props.centerid, this.props.nodes, this.props.links, width, height);
        /* builds the first graph based on after the component mounted and mountPoint was created. */
        // this.generateNetworkCanvas(this.props.centerid, this.props.nodes, this.props.links, this.state.text, width, height);
    }

    render() {
        return (
            <div>
                <div id="graph-container"></div>
            </div>
        );
    };
}

export default NodeGraph;