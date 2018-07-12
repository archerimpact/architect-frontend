"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reduxPersist = require("redux-persist");

var _storage = require("redux-persist/es/storage");

var _storage2 = _interopRequireDefault(_storage);

var _graphReducer = require("./graphReducer");

var _graphReducer2 = _interopRequireDefault(_graphReducer);

var _homeReducer = require("./homeReducer");

var _homeReducer2 = _interopRequireDefault(_homeReducer);

var _graphSidebarReducer = require("./graphSidebarReducer");

var _graphSidebarReducer2 = _interopRequireDefault(_graphSidebarReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {
    key: 'root',
    storage: _storage2.default
};

config.debug = true;
var reducers = {
    graph: _graphReducer2.default,
    graphSidebar: _graphSidebarReducer2.default,
    home: _homeReducer2.default
};

var reducer = (0, _reduxPersist.persistCombineReducers)(config, reducers);
exports.default = reducer;