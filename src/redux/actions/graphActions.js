import {UPDATE_GRAPH_DATA, OFFLINE_ACTIONS, TOGGLE_SIDEBAR, RESET_GRAPH, STORE_CURRENT_NODE, STORE_ENTITY, STORE_SEARCH_RESULTS} from "./actionTypes";
import _ from 'lodash';
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
    return (dispatch, getState) => {
        server.getNode(id, 1)
          .then(data => {
              let state = getState()
              let allNodes = state.graph.data.nodes.concat(data.nodes);
              let allLinks = state.graph.data.links.concat(data.links);
              let dataNodes = _.uniqBy(allNodes, (obj) => {return obj.id});
              let dataLinks = _.uniqBy(allLinks, (obj) => {return obj.id});
              graph.addData(data.centerid, makeDeepCopy(dataNodes), makeDeepCopy(dataLinks));
              graph.update();
              dispatch(updateGraphDispatch({nodes: dataNodes, links: dataLinks}));
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

