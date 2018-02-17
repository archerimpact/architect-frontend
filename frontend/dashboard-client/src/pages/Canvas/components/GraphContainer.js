import React, { Component } from 'react';

import NodeGraph from '../../../components/NodeGraph';

import Paper from 'material-ui/Paper';

class GraphContainer extends Component {

  constructor(props){
    super(props);
    this.getLinks = this.getLinks.bind(this);
  }

  getLinks(connections) {
    const newconnections = connections.slice();
    const links = newconnections.map((connection)=> {
      const vertex = connection.vertices.slice()
      return({"source": vertex[0].slice(), "target": vertex[1].slice()})
    });
    return links;
  }

  render(){
    return (
      <Paper>
        <NodeGraph nodes={this.props.vertexes.slice()} links={this.getLinks(this.props.connections.slice())} />
      </Paper>
    )
  }
}

export default GraphContainer