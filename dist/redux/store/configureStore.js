"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = configureStore;

var _redux = require("redux");

var _reduxPersist = require("redux-persist");

var _reduxLogger = require("redux-logger");

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reduxThunk = require("redux-thunk");

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require("../reducers");

var _reducers2 = _interopRequireDefault(_reducers);

var _reduxDevtoolsExtension = require("redux-devtools-extension");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var middleware = [_reduxThunk2.default];

var reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
middleware = [].concat(_toConsumableArray(middleware), [reduxImmutableStateInvariant, _reduxLogger2.default]);

function configureStore(initialState) {
    var store = (0, _redux.createStore)(_reducers2.default, undefined, (0, _reduxDevtoolsExtension.composeWithDevTools)(_redux.applyMiddleware.apply(undefined, _toConsumableArray(middleware))));
    var persistor = (0, _reduxPersist.persistStore)(store);
    return { persistor: persistor, store: store };
};