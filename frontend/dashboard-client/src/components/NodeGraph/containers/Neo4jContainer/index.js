import React, { Component } from 'react';

import Graph from '../../components/Graph';

import Paper from 'material-ui/Paper';

class GraphContainer extends Component {

  constructor(props){
    super(props);
    this.getLinks = this.getLinks.bind(this);
    this.getNodesFromRelationshipData = this.getNodesFromRelationshipData.bind(this);
    this.getIdFromUrl = this.getIdFromUrl.bind(this);
  }

  getIdFromUrl(neo4j_url){
    return neo4j_url.split('/').pop();
  }

  getLinks(relationshipData) {
    return relationshipData.map((data)=> {
      var connection = data[0]
      return({"source": this.getIdFromUrl(connection.start), "target": this.getIdFromUrl(connection.end)});
    });
  }

  getNodesFromRelationshipData(relationshipData) {
    return [].concat.apply([], relationshipData.map((data) => {
      var startNode = data[1]
      var endNode = data[2]
      return([
        {"_id": startNode.metadata.id, "name": startNode.data.name, "type": startNode.metadata.labels[0]},
        {"_id": endNode.metadata.id, "name": endNode.data.name, "type": endNode.metadata.labels[0]}
      ]);
    }));
  }

  render(){
    return (
      <Paper>
        <Graph 
          nodes={this.getNodesFromRelationshipData(this.props.relationshipData)} 
          links={this.getLinks(this.props.relationshipData)} 
          height={800}
          width={1000}
        />
      </Paper>
    )
  }
}

export default GraphContainer