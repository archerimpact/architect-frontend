import * as server from '../../../server';
import * as actions from '../../../redux/actions';

export const INITIALIZE_CANVAS = "INITIALIZE_CANVAS";
export const UPDATE_GRAPH_DATA = "UPDATE_GRAPH_DATA";
export const STORE_SEARCH_RESULTS = "STORE_SEARCH_RESULTS";
export const STORE_CURRENT_NODE = "STORE_CURRENT_NODE";
export const UPDATE_PROJECT_DATA = "UPDATE_PROJECT_DATA";

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

export function saveCurrentProjectData(graph) {
  return (dispatch, getState) => {
    let state = getState()
    let projid = state.data.currentProject._id
    let data = graph.fetchData();
    data.nodes = data.nodes.map((d) => {
      return {id: d.id, type: d.type, name: d.name, linksCount: d.linksCount}
    })
    let imageString = graph.saveGraphAsSVGString();
    server.updateProject({id: projid, d3Data: data, image: ''})
      .then((response) => {
        dispatch(updateProjectDispatch({id: projid, data: data}));
      })
      .catch((err) => { console.log(err)});
  }
}

function updateProjectDispatch(data) {
  return {
    type: UPDATE_PROJECT_DATA,
    payload: data
  };
}

// export function updateGraph(graph, graphData) {
//   return (dispatch, getState) => {
//     // var graphData = parseNeo4jData(data);
//     graph.setData(graphData.centerid, makeDeepCopy(graphData.nodes), makeDeepCopy(graphData.links));
//     dispatch(updateGraphDispatch(graphData))
//   }
// }

function updateGraphDispatch(data) {
  return {
    type: UPDATE_GRAPH_DATA,
    payload: data
  };
}

export function storeCurrentNodeDispatch(d) {
  return {
    type: STORE_CURRENT_NODE,
    payload: d
  }
}

export function initializeDisplayFunctions(graph, displayFunctions) {
  graph.bindDisplayFunctions(displayFunctions)
}

function makeDeepCopy(array) {
  var newArray = [];
  array.map((object) => {
    return newArray.push(Object.assign({}, object));
  });
  return newArray;
}


export function addToGraphFromId(graph, id) {
  return (dispatch, getState) => {
    function setCurrentNode(d) {
      dispatch(storeCurrentNodeDispatch(d.id));
      // graph.translateGraphAroundNode(d)
    }

    server.getNode(id)
      .then(data => {
        // var graphData = parseNeo4jData(data);
        var graphData = data;
        graph.bindDisplayFunctions({node: setCurrentNode});
        graph.addData(graphData.centerid, makeDeepCopy(graphData.nodes), makeDeepCopy(graphData.links));
        dispatch(updateGraphDispatch(graphData));
      })
      .catch(err => { console.log(err); });
    }
}

export function fetchGraphFromId(graph, id) {
  return (dispatch, getState) => {
    function setCurrentNode(d) {
      dispatch(storeCurrentNodeDispatch(d.id));
      // graph.translateGraphAroundNode(d)
    }

    server.getGraph(id)
      .then(data => {
        // var graphData = parseNeo4jData(data);
        var graphData = data;
        graph.bindDisplayFunctions({node: setCurrentNode});
        graph.setData(graphData.centerid, makeDeepCopy(graphData.nodes), makeDeepCopy(graphData.links));
        dispatch(updateGraphDispatch(graphData));
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

export function fetchSearchResults(query) {
  return (dispatch) => {
    server.searchBackendText(query)
      .then((data)=>{
        dispatch(storeSearchResults(data.hits.hits));
        // fetchGraphFromId(graph, data.hits.hits[0]._source.neo4j_id)
      })
      .catch((error) => console.log(error));
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
    return parseInt(neo4j_url.split('/').pop(), 10); //neo4j relationship stores the url to the nodes, id is in the last part of the url
  };

  var nodesData = data[1];
  var neo4jtoindex = {};
  var nodes, links;

  nodes = nodesData.map((node, i) => {
    neo4jtoindex[parseInt(node.metadata.id, 10)] = i; //store a dictionary mapping neo4j_id to the index
    if (typeof(node.metadata) === "undefined") { console.log("error in that node.metadata is undefined"); }    
    return {
      id: parseInt(node.metadata.id, 10),
      type: node.metadata.labels[0],
      name: node.data.name,
      // resigned_on: node.data.resigned_on,
      // occupation: node.data.occupation,
      // address: node.data.address,
      // nationality: node.data.nationality,
      // country_of_residence: node.data.country_of_residence,
      // date_of_birth: node.data.date_of_birth,
      // appointed_on: node.data.appointed_on
    };
  });

  links = data[0].map((edge) => {
    //target and source have to reference the index of the node
    return { id: edge.metadata.id, type: edge.metadata.type, source: getidfromurl(edge.start), target: getidfromurl(edge.end) };
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