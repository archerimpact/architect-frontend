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

    componentDidMount() {
        this.state.graph.generateCanvas(width, height);
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