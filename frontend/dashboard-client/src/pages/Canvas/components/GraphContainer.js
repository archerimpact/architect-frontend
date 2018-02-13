import React, { Component } from 'react';

import NodeGraph from '../../../components/NodeGraph';

import Paper from 'material-ui/Paper';

class GraphContainer extends Component {

  constructor(props){
    super(props);
    this.getLinks = this.getLinks.bind(this);
  }

  getLinks(connections) {
    debugger
    var newconnections = connections.slice();
    var links = newconnections.map((connection)=> {
      return({"source": connection.vertices[0], "target": connection.vertices[1]})
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