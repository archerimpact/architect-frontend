"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchSearchResults = fetchSearchResults;
exports.fetchCurrentEntity = fetchCurrentEntity;
exports.clearCurrentEntity = clearCurrentEntity;

var _actionTypes = require("../actions/actionTypes");

var _utils = require("./utils");

var _server = require("../../server");

var server = _interopRequireWildcard(_server);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* =============================================================================================  */

function fetchSearchResultsDispatch(data) {
    return {
        type: _actionTypes.SEARCH_DATA,
        payload: data
    };
}

function fetchSearchResults(query) {
    return function (dispatch) {
        if (_actionTypes.OFFLINE_ACTIONS) return;
        server.searchBackendText(query).then(function (data) {
            dispatch(fetchSearchResultsDispatch(data));
        }).catch(function (error) {
            return console.log(error);
        });
    };
}

/* =============================================================================================  */

function setCurrentEntityDispatch(node) {
    return {
        type: _actionTypes.ENTITY_SET,
        payload: node
    };
}

function addToEntityCache(node) {
    return {
        type: _actionTypes.ENTITY_CACHE_ADD,
        payload: [node]
    };
}

function reshuffleEntityCache(newEntityCache) {
    return {
        type: _actionTypes.ENTITY_CACHE_RESORT,
        payload: newEntityCache
    };
}

function fetchCurrentEntity(node) {
    return function (dispatch, getState) {
        if (_actionTypes.OFFLINE_ACTIONS) return;
        var currentNodeId = node.id;
        var entityCache = getState().graphSidebar.entityCache;
        var entityCacheLength = entityCache.length;
        var nodeInEntityCache = false;
        var i = void 0;
        for (i = 0; i < entityCacheLength; i++) {
            if (entityCache[i].id === currentNodeId) {
                nodeInEntityCache = true;
                break;
            }
        }
        if (entityCache.length > 100) {
            dispatch(reshuffleEntityCache(entityCache.slice(0, 50)));
        }
        if (!nodeInEntityCache) {
            server.getNode(currentNodeId, 1).then(function (data) {
                data["id"] = currentNodeId;
                dispatch(setCurrentEntityDispatch(data));
                dispatch(addToEntityCache(data));
            }).catch(function (err) {
                return console.log(err);
            });
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
        type: _actionTypes.ENTITY_RESET
    };
}

function clearCurrentEntity() {
    return function (dispatch) {
        dispatch(clearCurrentEntityDisptach());
    };
}

/* =============================================================================================  */