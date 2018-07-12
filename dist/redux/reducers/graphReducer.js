"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.TOGGLE_SIDEBAR:
            return _extends({}, state, {
                sidebarVisible: !state.sidebarVisible
            });
        case _actionTypes.RESET_GRAPH:
            return _extends({}, state, {
                data: {
                    nodes: [],
                    links: []
                },
                currentNode: null
            });
        case _actionTypes.STORE_SEARCH_RESULTS:
            return _extends({}, state, {
                canvas: _extends({}, state.canvas, {
                    searchData: action.payload
                })
            });
        case _actionTypes.STORE_CURRENT_NODE:
            return _extends({}, state, {
                currentNode: {
                    id: action.payload
                }
            });
        case _actionTypes.UPDATE_GRAPH_DATA:
            return _extends({}, state, {
                data: {
                    nodes: action.payload.nodes,
                    links: action.payload.links
                }
            });
        case _actionTypes.STORE_ENTITY:
            return _extends({}, state, {
                entityCache: action.payload.concat(state.entityCache)
            });
        case _actionTypes.REORDER_ENTITY_CACHE:
            return _extends({}, state, {
                entityCache: action.payload
            });
        case _actionTypes.LOAD_DATA:
            return _extends({}, state, {
                data: action.payload
            });
        default:
            return state;
    }
};

var _actionTypes = require("../actions/actionTypes");

var initialState = {
    sidebarVisible: true,
    canvas: {
        searchData: []
    },
    entityCache: [],
    data: {
        nodes: [],
        links: []
    },
    currentNode: null
};