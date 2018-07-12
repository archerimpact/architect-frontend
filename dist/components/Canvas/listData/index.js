"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _fastLevenshtein = require("fast-levenshtein");

var _fastLevenshtein2 = _interopRequireDefault(_fastLevenshtein);

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _graphActions = require("../../../redux/actions/graphActions");

var graphActions = _interopRequireWildcard(_graphActions);

var _entityCard = require("../entityCard");

var _entityCard2 = _interopRequireDefault(_entityCard);

var _fuse = require("fuse.js");

var Fuse = _interopRequireWildcard(_fuse);

require("./style.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListData = function (_Component) {
    _inherits(ListData, _Component);

    function ListData(props) {
        _classCallCheck(this, ListData);

        var _this = _possibleConstructorReturn(this, (ListData.__proto__ || Object.getPrototypeOf(ListData)).call(this, props));

        _this.fetchListResults = function (query) {
            var nodes = _this.props.data.nodes;
            var options = {
                keys: ['name', 'combined', 'label', 'description']
            };
            var fuse = new Fuse(nodes, options);
            return fuse.search(query);
        };

        _this.state = {
            listDataSearchResults: []
        };
        return _this;
    }

    _createClass(ListData, [{
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
                var nextQuery = nextprops.match.params.query;
                if (nextQuery == null) {
                    this.setState({ listDataSearchResults: [] });
                } else if (nextprops.match.params.sidebarState === 'list') {
                    if (this.props.match.params.query !== nextQuery) {
                        this.setState({ listDataSearchResults: this.fetchListResults(decodeURIComponent(nextprops.match.params.query)) });
                    }
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                graph = _props.graph,
                data = _props.data;

            return _react2.default.createElement(
                "div",
                { className: "sidebar-content-container" },
                _react2.default.createElement(
                    "div",
                    { className: "search-results" },
                    this.state.listDataSearchResults.length !== 0 ? this.state.listDataSearchResults.map(function (node) {
                        return _react2.default.createElement(_entityCard2.default, { key: node.id, node: node, graph: graph, data: data });
                    }) : this.props.data.nodes.map(function (node) {
                        return _react2.default.createElement(_entityCard2.default, { key: node.id, node: node, graph: graph, data: data });
                    })
                )
            );
        }
    }]);

    return ListData;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(graphActions, dispatch),
        dispatch: dispatch
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(ListData));