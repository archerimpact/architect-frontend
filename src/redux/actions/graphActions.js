import {TOGGLE_SIDEBAR, RESET_GRAPH, STORE_CURRENT_NODE, STORE_ENTITY, STORE_SEARCH_RESULTS, UPDATE_GRAPH_DATA} from "./actionTypes";

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
    }
}

export function setCurrentNode(d) {
    return (dispatch) => {
        dispatch(storeCurrentNodeDispatch(d.id));
    }
}

/* =============================================================================================  */

export function addToGraphFromId(graph, id) {
    return (dispatch) => {
        server.getNode(id)
        .then(data => {
            graph.addData(data.centerid, makeDeepCopy(data.nodes), makeDeepCopy(data.links));
            graph.update();
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