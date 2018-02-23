import React, { Component } from 'react';

import Graph from '../../components/Graph';

import Paper from 'material-ui/Paper';

class GraphContainer extends Component {

  constructor(props){
    super(props);
    this.getLinks = this.getLinks.bind(this);
    this.getNodes = this.getNodes.bind(this);
  }

  getLinks(connections) {
    var links = connections.map((connection)=> {
      return({"source": connection.vertices[0], "target": connection.vertices[1]})
    });
    return links;
  }

  getNodes(vertexes){
    return vertexes.map((vertex)=>{
      return({"_id": vertex._id, "name": vertex.name, "type": vertex.type})
    })
  }

  render(){
    return (
      <Graph nodes={this.getNodes(this.props.vertexes)} links={this.getLinks(this.props.connections)} height={800} width={1000} />
    )
  }
}

export default GraphContainer