"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case _actionTypes.SEARCH_DATA:
            return _extends({}, state, {
                searchData: action.payload
            });
        case _actionTypes.UPDATE_GRAPH_DATA || _actionTypes.LOAD_DATA:
            return _extends({}, state, {
                listData: action.payload.nodes
            });
        case _actionTypes.RESET_GRAPH:
            return _extends({}, state, {
                listData: []
            });
        case _actionTypes.ENTITY_SET:
            return _extends({}, state, {
                currentEntity: action.payload
            });
        case _actionTypes.ENTITY_RESET:
            return _extends({}, state, {
                currentEntity: false
            });
        case _actionTypes.ENTITY_CACHE_RESORT:
            return _extends({}, state, {
                entityCache: action.payload
            });
        case _actionTypes.ENTITY_CACHE_ADD:
            return _extends({}, state, {
                entityCache: action.payload.concat(state.entityCache)
            });
        default:
            return state;
    }
};

var _actionTypes = require("../actions/actionTypes");

var initialState = {
    searchData: [],
    listData: [],
    currentEntity: null,
    entityCache: []
};