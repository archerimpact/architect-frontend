import {UPDATE_GRAPH_DATA, OFFLINE_ACTIONS, TOGGLE_SIDEBAR, RESET_GRAPH, STORE_CURRENT_NODE, STORE_ENTITY, STORE_SEARCH_RESULTS} from "./actionTypes";

import * as server from "../../server/index";

/* =========================================== HELPERS ==========================================  */

// Redux state cannot be mutated. Must create new copies of objects - function here ensures that
function makeDeepCopy(array) {
    let newArray = [];
    array.map((object) => {
        return newArray.push(Object.assign({}, object));
    });
    return newArray;
}

/* =============================================================================================  */

export function storeCurrentNodeDispatch(id) {
    return {
        type: STORE_CURRENT_NODE,
        payload: id
    };
}

export function setCurrentNode(d) {
    return (dispatch) => {
        if (OFFLINE_ACTIONS) return;
        dispatch(storeCurrentNodeDispatch(d.id));
    };
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
        server.getNode(id, 1)
          .then(data => {
              graph.addData(data.centerid, makeDeepCopy(data.nodes), makeDeepCopy(data.links));
              graph.update();
              dispatch(updateGraphDispatch(data));
          })
          .catch(err => {
              console.log(err);
          });
    };
}

/* =============================================================================================  */

function fetchSearchResultsDispatch(data) {
    return {
        type: STORE_SEARCH_RESULTS,
        payload: data
    };
}

export function fetchSearchResults(query) {
    return (dispatch) => {
        if (OFFLINE_ACTIONS) return;
        server.searchBackendText(query)
        .then((data) => {
            dispatch(fetchSearchResultsDispatch(data));
        })
        .catch((error) => console.log(error));
    }
}

/* =============================================================================================  */

function fetchEntityDispatch(entity) {
    return {
        type: STORE_ENTITY,
        payload: entity
    };
}

function fetchEntityDataFormatter(data) {
    console.log("fetchEntityDataFormat", data);
    let nodes = data.nodes;
    let linksLength = data.links.length;
    for (let i=0; i < linksLength; i++) {
        // nodes[i]
    }

    return [data]
}

export function fetchEntity(id) {
    return (dispatch) => {
        if (OFFLINE_ACTIONS) return;
        server.getNode(id, 1)
            .then(data => {
                let formattedResponse = fetchEntityDataFormatter(data);
                dispatch(fetchEntityDispatch(formattedResponse));
            })
            .catch(err => console.log(err));
    };
} // refactor so the data formatting goes on here (and a node itself is actually selected rather than saving 1 degree. 1) Why are we
// even getting 1 degree, shouldn't the selection happen on backend? Is it at all useful
// 2) for search results, can we augment with the necessary field so we don't have to bombard the server everytime we
// search with additional getNode calls


export function resetGraphDispatch() {
    return {
        type: RESET_GRAPH,
    };
}

/* =============================================================================================  */

export function toggleSidebar() {
    return {
        type: TOGGLE_SIDEBAR
    }
}

