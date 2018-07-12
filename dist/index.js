"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _configureStore2 = require("./redux/store/configureStore");

var _configureStore3 = _interopRequireDefault(_configureStore2);

var _Root = require("./App/Root/");

var _Root2 = _interopRequireDefault(_Root);

var _registerServiceWorker = require("./registerServiceWorker");

var _registerServiceWorker2 = _interopRequireDefault(_registerServiceWorker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _configureStore = (0, _configureStore3.default)({}),
    persistor = _configureStore.persistor,
    store = _configureStore.store;

(0, _registerServiceWorker2.default)();

_reactDom2.default.render(_react2.default.createElement(_Root2.default, { store: store, persistor: persistor }), document.getElementById('root'));