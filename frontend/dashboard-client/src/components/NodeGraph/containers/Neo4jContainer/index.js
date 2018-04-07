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

  getDataForGraph(data) {  
    data = data[0] //because the neo4j data resides in data[0]

    function getidfromurl(neo4j_url){
      return parseInt(neo4j_url.split('/').pop()); //neo4j relationship stores the url to the nodes, id is in the last part of the url
    }
    var nodesData = data[1] 
    var neo4jtoindex = {}
    var nodes;
    var links;
    nodes = nodesData.map((node, i)=> {
      neo4jtoindex[parseInt(node.metadata.id)] = i //store a dictionary mapping neo4j_id to the index
      return {id: parseInt(node.metadata.id), 
        type: node.metadata.labels[0], 
        name: node.data.name,
        resigned_on: node.data.resigned_on,
        occupation: node.data.occupation,
        address: node.data.address,
        nationality: node.data.nationality,
        country_of_residence: node.data.country_of_residence,
        date_of_birth: node.data.date_of_birth,
        appointed_on: node.data.appointed_on
      }
    })
    links = data[0].map((edge)=> {
      //target and source have to reference the index of the node
      return {id: edge.metadata.id, type: edge.metadata.type, source: neo4jtoindex[getidfromurl(edge.start)], target: neo4jtoindex[getidfromurl(edge.end)]}
    })
    return {nodes: nodes, links: links, centerid: data[2].metadata.id}
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
    if (this.props.graphData == null){
      return (
        <div></div>
      );
    } else {
      const data = this.getDataForGraph(this.props.graphData)
      return (
          <Graph 
            nodes={data.nodes} 
            links={data.links} 
            centerid={this.props.graphData[0][2].metadata.id}
            height={600}
            width={1000}
          />
      )
    }
  }
}

export default GraphContainer