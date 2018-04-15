import * as server from '../../../server';

export const INITIALIZE_CANVAS = "INITIALIZE_CANVAS";
export const UPDATE_GRAPH_DATA = "UPDATE_GRAPH_DATA";
export const STORE_SEARCH_RESULTS = "STORE_SEARCH_RESULTS";

export function initializeCanvas(graph, width, height) {
  return (dispatch, getState) => {
    graph.generateCanvas(width, height);
    dispatch(initializeCanvasDispatch(graph))
  };
}

function initializeCanvasDispatch(graph) {
  return {
    type: INITIALIZE_CANVAS,
    payload: graph
  };
}

export function updateGraph(data) {
  return (dispatch, getState) => {
    var graphData = parseNeo4jData(data);
    let g = getState().canvas.graph;
    g.setData(graphData.cenerid, graphData.nodes, graphData.links);
    dispatch(updateGraphDispatch(graphData))
  }
}

function updateGraphDispatch(data) {
  return {
    type: UPDATE_GRAPH_DATA,
    payload: data
  };
}


export function fetchGraphFromId(graph, id) {
  return (dispatch, getState) => {
  server.getGraph(id)
    .then(data => {
      var graphData = parseNeo4jData(data);
      graph.setData(graphData.cenerid, graphData.nodes, graphData.links);
      dispatch(updateGraphDispatch(graphData))
    })
    .catch(err => { console.log(err); });
  }
}

// export function fetchGraphFromQuery(query) {

//   server.getGraph(id)
//     .then(data => {
//       updateGraph(data);
//     })
//     .catch(err => { console.log(err); });
// }

export function fetchSearchResults(graph, query) {
  return (dispatch) => {
    server.searchBackendText(query)
      .then((data)=>{
        dispatch(storeSearchResults(data.hits.hits));
        fetchGraphFromId(graph, data.hits.hits[0]._source.neo4j_id)
      })
      .catch((error) => { debugger; console.log(error); });
  }
}
function storeSearchResults(data) {
  return {
    type: STORE_SEARCH_RESULTS,
    payload: data
  }
}

function parseNeo4jData(data) {
  data = data[0]; //because the neo4j data resides in data[0]

  function getidfromurl(neo4j_url) {
    return parseInt(neo4j_url.split('/').pop()); //neo4j relationship stores the url to the nodes, id is in the last part of the url
  };

  var nodesData = data[1];
  var neo4jtoindex = {};
  var nodes, links;

  nodes = nodesData.map((node, i) => {
    neo4jtoindex[parseInt(node.metadata.id)] = i; //store a dictionary mapping neo4j_id to the index
    return {
      id: parseInt(node.metadata.id),
      type: node.metadata.labels[0],
      name: node.data.name,
      resigned_on: node.data.resigned_on,
      occupation: node.data.occupation,
      address: node.data.address,
      nationality: node.data.nationality,
      country_of_residence: node.data.country_of_residence,
      date_of_birth: node.data.date_of_birth,
      appointed_on: node.data.appointed_on
    };
  });

  links = data[0].map((edge) => {
    //target and source have to reference the index of the node
    return { id: edge.metadata.id, type: edge.metadata.type, source: neo4jtoindex[getidfromurl(edge.start)], target: neo4jtoindex[getidfromurl(edge.end)] };
  });

  return { nodes: nodes, links: links, centerid: data[2].metadata.id };
}

  // searchBackend(query){
    // server.searchBackendText(query)
    //   .then((data)=>{
    //     this.setState( {searchData: data.hits.hits, nodesData: null} );
    //     this.fetchGraph(data.hits.hits[0]._source.neo4j_id);
    //     var ids = data.hits.hits.map((item) => {
    //       return item._source.neo4j_id
    //     });
    //     this.searchBackendNodes(ids); //use the neo4jids of the elastic results to get all data
    //   })
    //   .catch((error) => { console.log(error); });
  // }

  // searchBackendNodes(idsArray){
  //   server.getBackendNodes(idsArray)
  //     .then(data => {
  //         this.setState( {nodesData: data} );      
  //     })
  //     .catch(err => { console.log(err); });
  // }