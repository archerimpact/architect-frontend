// import React, { Component } from 'react';

// // import Graph from '../../components/Graph';
// import Graph from '../../components/Graph';
// import Paper from 'material-ui/Paper';

// class GraphContainer extends Component {

//   constructor(props){
//     super(props);
//     this.getLinks = this.getLinks.bind(this);
//     this.getNodesFromRelationshipData = this.getNodesFromRelationshipData.bind(this);
//     this.getIdFromUrl = this.getIdFromUrl.bind(this);
//   }

//   render(){
//     if (this.props.graphData == null){
//       return (
//         <div></div>
//       );
//     } else {
//       const data = this.getDataForGraph(this.props.graphData)
//       return (
//           <Graph 
//             nodes={data.nodes} 
//             links={data.links} 
//             centerid={this.props.graphData[0][2].metadata.id}
//           />
//       )
//     }
//   }
// }

// export default GraphContainer;