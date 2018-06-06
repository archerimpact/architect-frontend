import {
  STORE_CURRENT_NODE,
  STORE_SEARCH_RESULTS,
  UPDATE_GRAPH_DATA,
  RESET_GRAPH,
  STORE_ENTITY
} from './actionTypes';

import * as server from '../../server/index';

/* =========================================== HELPERS ==========================================  */

// Redux state cannot be mutated. Must create new copies of objects - function here ensures that
function makeDeepCopy(array) {
  var newArray = [];
  array.map((object) => {
    return newArray.push(Object.assign({}, object));
  });
  return newArray;
}

// Action subroutine to call when wanting to update a graph (saving it under a project)
export function saveCurrentProjectData(graph) {
  return (dispatch, getState) => {
    let state = getState();
    let projid = state.project.currentProject._id;
    let data = graph.fetchData();
    console.log("saveCurrentProjectData", data)
    server.updateProject({id: projid, d3Data: data, image: ''})
    .then((res) => {
      if (res.success) {
        dispatch(updateGraphDispatch(data))
      } else {
        console.log("graph did not update successfully!")
        // TODO flash messages for failures on parent page
      }
    })
    .catch((err) => {
      console.log(err)
    });
  }
}

/* =============================================================================================  */

export function storeCurrentNodeDispatch(id) {
  return {
    type: STORE_CURRENT_NODE,
    payload: id
  }
}

export function setCurrentNode(d) {
  return (dispatch) => {
    dispatch(storeCurrentNodeDispatch(d.id));
  }
}

/* =============================================================================================  */

function updateGraphDispatch(data) {
  return {
    type: UPDATE_GRAPH_DATA,
    payload: data
  };
}

export function addToGraphFromId(graph, id) {
  return (dispatch) => {
    server.getNode(id)
    .then(data => {
      console.log("data", data);
      graph.addData(data.centerid, makeDeepCopy(data.nodes), makeDeepCopy(data.links));
      console.log("graph", graph)
      dispatch(saveCurrentProjectData(graph))
      // dispatch(updateGraphDispatch(data)); // right here change to saveCurrentProjectData
    })
    .catch(err => {
      console.log(err);
    });
  }
}

/* =============================================================================================  */

function fetchSearchResultsDispatch(data) {
  return {
    type: STORE_SEARCH_RESULTS,
    payload: data
  }
}

export function fetchSearchResults(query) {
  return (dispatch) => {
    server.searchBackendText(query)
    .then((data) => {
      dispatch(fetchSearchResultsDispatch(data.hits.hits));
    })
    .catch((error) => console.log(error));
  }
}

/* =============================================================================================  */

function fetchEntityDispatch(entity) {
  return {
    type: STORE_ENTITY,
    payload: entity
  }
}

export function fetchEntity(id) {
  return (dispatch) => {
    server.getNode(id)
    .then(data => {
      dispatch(fetchEntityDispatch(data))
    })
    .catch(err => console.log(err))
  }
}

/* =============================================================================================  */

export function resetProject(project) {
  return {
    type: RESET_GRAPH,
    payload: project
  };
}

/* ===================================== ACTIONS THAT ARE NOT IN USE ========================================  */


// function parseNeo4jData(data) {
//     data = data[0]; //because the neo4j data resides in data[0]
//
//     function getidfromurl(neo4j_url) {
//         return parseInt(neo4j_url.split('/').pop(), 10); //neo4j relationship stores the url to the nodes, id is in the last part of the url
//     };
//
//     var nodesData = data[1];
//     var neo4jtoindex = {};
//     var nodes, links;
//
//     nodes = nodesData.map((node, i) => {
//         neo4jtoindex[parseInt(node.metadata.id, 10)] = i; //store a dictionary mapping neo4j_id to the index
//         if (typeof(node.metadata) === "undefined") { console.log("error in that node.metadata is undefined"); }
//         return {
//             id: parseInt(node.metadata.id, 10),
//             type: node.metadata.labels[0],
//             name: node.data.name,
//             // resigned_on: node.data.resigned_on,
//             // occupation: node.data.occupation,
//             // address: node.data.address,
//             // nationality: node.data.nationality,
//             // country_of_residence: node.data.country_of_residence,
//             // date_of_birth: node.data.date_of_birth,
//             // appointed_on: node.data.appointed_on
//         };
//     });
//
//     links = data[0].map((edge) => {
//         //target and source have to reference the index of the node
//         return { id: edge.metadata.id, type: edge.metadata.type, source: getidfromurl(edge.start), target: getidfromurl(edge.end) };
//     });
//
//     return { nodes: nodes, links: links, centerid: data[2].metadata.id };
// }


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


// export function fetchGraphFromQuery(query) {

//   server.getGraph(id)
//     .then(data => {
//       updateGraph(data);
//     })
//     .catch(err => { console.log(err); });
// }


// export function fetchGraphFromId(graph, id) {
//     return (dispatch, getState) => {
//         function setCurrentNode(d) {
//             dispatch(storeCurrentNodeDispatch(d.id));
//             // graph.translateGraphAroundNode(d)
//         }
//         server.getGraph(id)
//             .then(data => {
//                 // var graphData = parseNeo4jData(data);
//                 var graphData = data;
//                 graph.setData(graphData.centerid, makeDeepCopy(graphData.nodes), makeDeepCopy(graphData.links));
//                 dispatch(updateGraphDispatch(graphData));
//             })
//             .catch(err => { console.log(err); });
//     }
// }


// function updateProjectDispatch(data) {
//   return {
//     type: UPDATE_PROJECT_DATA,
//     payload: data
//   };
// }

// export function updateGraph(graph, graphData) {
//   return (dispatch, getState) => {
//     // var graphData = parseNeo4jData(data);
//     graph.setData(graphData.centerid, makeDeepCopy(graphData.nodes), makeDeepCopy(graphData.links));
//     dispatch(updateGraphDispatch(graphData))
//   }
// }