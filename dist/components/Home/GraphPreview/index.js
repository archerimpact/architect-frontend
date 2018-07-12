"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _Graph = require("../../Canvas/Graph/");

var _Graph2 = _interopRequireDefault(_Graph);

var _GraphClass = require("../../Canvas/Graph/package/GraphClass");

var _GraphClass2 = _interopRequireDefault(_GraphClass);

var _server = require("../../../server/");

var server = _interopRequireWildcard(_server);

var _homeActions = require("../../../redux/actions/homeActions");

var homeActions = _interopRequireWildcard(_homeActions);

var _reactRedux = require("react-redux");

var _graphActions = require("../../../redux/actions/graphActions");

var _reactLoadScript = require("react-load-script");

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

require("./style.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GraphPreview = function (_Component) {
    _inherits(GraphPreview, _Component);

    function GraphPreview(props) {
        _classCallCheck(this, GraphPreview);

        var _this = _possibleConstructorReturn(this, (GraphPreview.__proto__ || Object.getPrototypeOf(GraphPreview)).call(this, props));

        _this.updateWindowDimensions = function () {
            _this.setState({ width: _this.refs.graphPreviewBox.clientWidth, height: _this.refs.graphPreviewBox.clientHeight });
        };

        _this.loadDataToMainGraph = function () {
            _this.props.dispatch((0, _graphActions.loadData)(_this.props.vignetteGraphData[_this.props.index]));
        };

        _this.renderGraph = function () {
            if (_this.state.width && _this.state.height) {
                return _react2.default.createElement(_Graph2.default, { graph: _this.graph, height: _this.state.height, width: _this.state.width, displayMinimap: false, allowKeycodes: false, data: _this.props.vignetteGraphData[_this.props.index] });
            }
        };

        _this.state = { width: null, height: null, ref: null };

        if (_this.props.graph) {
            _this.graph = _this.props.graph;
        } else {
            _this.graph = new _GraphClass2.default();
        }
        return _this;
    }

    _createClass(GraphPreview, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            this.updateWindowDimensions();
            this.refs.graphPreviewBox.addEventListener('resize', this.updateWindowDimensions);

            server.searchBackendText("Dan Gertler") // hardcoded for now, don't worry too much about it until we decide this way of doing the narratives is conceptually best
            .then(function (data) {
                var neo4j_id = data[0].id;
                _this2.props.dispatch(homeActions.addToVignetteFromId(_this2.graph, neo4j_id, _this2.props.index));
            }).catch(function (err) {
                console.log(err);
            });
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.refs.graphPreviewBox.removeEventListener('resize', this.updateWindowDimensions);
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                "div",
                { className: "graph-preview" },
                _react2.default.createElement(_reactLoadScript2.default, { url: "https://platform.twitter.com/widgets.js" }),
                _react2.default.createElement(
                    "div",
                    { className: "graph-card", ref: "graphPreviewBox" },
                    this.renderGraph()
                ),
                _react2.default.createElement(
                    "div",
                    { className: "graph-preview-footer flex-row" },
                    _react2.default.createElement(
                        "div",
                        { className: "graph-preview-share-icons" },
                        _react2.default.createElement(
                            "a",
                            { href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent((this.props.title ? '"' + this.props.title + '" - Try out an interactive way to experience case studies like this' : 'Try out an interactive way to experience case studies') + " (and explore your favorite sanctioned networks!) on #ArcherViz @archerimpact " + (this.props.url || "https://viz.archerimpact.com")) },
                            _react2.default.createElement("i", { className: "graph-preview-action twitter-action fab fa-twitter" })
                        ),
                        _react2.default.createElement("i", { className: "graph-preview-action link-action fas fa-link" })
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "ml-auto" },
                        _react2.default.createElement(
                            _reactRouterDom.Link,
                            { to: "/explore" },
                            _react2.default.createElement(
                                "button",
                                { className: "btn btn-primary graph-preview-explore-button", onClick: function onClick() {
                                        return _this3.loadDataToMainGraph();
                                    } },
                                "Explore In Depth",
                                _react2.default.createElement(
                                    "i",
                                    { className: "explore-icon material-icons" },
                                    "launch"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return GraphPreview;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        vignetteGraphData: state.home.vignetteGraphData
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GraphPreview));