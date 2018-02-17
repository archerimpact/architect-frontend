import React, { Component } from 'react';

import Graph from '../../components/Graph';

import Paper from 'material-ui/Paper';

class GraphContainer extends Component {

  constructor(props){
    super(props);
    this.getLinks = this.getLinks.bind(this);
    this.getNodes = this.getNodes.bind(this);
    this.getNodesFromConnections = this.getNodesFromConnections.bind(this);
    this.getIdFromUrl = this.getIdFromUrl.bind(this);
  }

  getIdFromUrl(neo4j_url){
    return neo4j_url.split('/').pop();
  }

  getLinks(connections) {
    return connections.map((tuple)=> {
      var connection = tuple[0]
      return({"source": this.getIdFromUrl(connection.start), "target": this.getIdFromUrl(connection.end)});
    });
  }

  getNodesFromConnections(connections) {
    return [].concat.apply([], connections.map((tuple) => {
      var startNode = tuple[2]
      var endNode = tuple[1]
      return([
        {"_id": startNode.metadata.id, "name": startNode.data.name, "type": startNode.metadata.labels[0]},
        {"_id": endNode.metadata.id, "name": endNode.data.name, "type": endNode.metadata.labels[0]}
      ]);
    }));
  }

  getNodes(vertexes){
    return vertexes.map((vertex)=>{
      return({"_id": vertex._id, "name": vertex.name, "type": vertex.type});
    });
  }

  render(){
    return (
      <Paper>
        <Graph 
          nodes={this.getNodesFromConnections(this.props.connections)} 
          links={this.getLinks(this.props.connections)} 
          height={800}
          width={1000}
        />
      </Paper>
    )
  }
}

export default GraphContainer