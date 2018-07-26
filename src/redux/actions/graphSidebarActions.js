import {
    OFFLINE_ACTIONS,
    SEARCH_DATA,
    ENTITY_SET,
    ENTITY_CACHE_RESORT,
    ENTITY_CACHE_ADD,
    ENTITY_RESET
} from "../actions/actionTypes";

import {arraySwap} from "./utils"
import * as server from "../../server";

/* =============================================================================================  */

function fetchSearchResultsDispatch(data) {
    return {
        type: SEARCH_DATA,
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


function setCurrentEntityDispatch(node) {
    return {
        type: ENTITY_SET,
        payload: node
    };
}

function addToEntityCache(node) {
    return {
        type: ENTITY_CACHE_ADD,
        payload: [node]
    }
}

function reshuffleEntityCache(newEntityCache) {
    return {
        type: ENTITY_CACHE_RESORT,
        payload: newEntityCache
    }
}

export function fetchCurrentEntity(node) {
    return (dispatch, getState) => {
        if (OFFLINE_ACTIONS) return;
        let currentNodeId = node.id;
        let entityCache = getState().graphSidebar.entityCache;
        let entityCacheLength = entityCache.length;
        let nodeInEntityCache = false;
        let i;
        for (i=0; i < entityCacheLength; i++) {
            if (entityCache[i].id === currentNodeId) {
                nodeInEntityCache = true;
                break;
            }
        }
        if (entityCache.length > 100) {
            dispatch(reshuffleEntityCache(entityCache.slice(0, 50)))
        }
        if (!nodeInEntityCache) {
            server.getNode(currentNodeId, 1)
                .then((data) => {
                    data["id"] = currentNodeId;
                    dispatch(setCurrentEntityDispatch(data));
                    dispatch(addToEntityCache(data));
                })
                .catch((err) => console.log(err));
        } else {
            dispatch(setCurrentEntityDispatch(entityCache[i]));
            // let newEntityCache = arraySwap(entityCache, i, 0);
            // dispatch(reshuffleEntityCache(newEntityCache));
        }
    };
}

/* =============================================================================================  */


function clearCurrentEntityDisptach() {
    return {
        type: ENTITY_RESET,
    }
}

export function clearCurrentEntity() {
    return (dispatch) => {
        dispatch(clearCurrentEntityDisptach())
    }
}

/* =============================================================================================  */
