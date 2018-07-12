"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _server = require("../../../server");

var server = _interopRequireWildcard(_server);

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _graphActions = require("../../../redux/actions/graphActions");

var graphActions = _interopRequireWildcard(_graphActions);

var _entityAttributes = require("../entityAttributes");

var _entityAttributes2 = _interopRequireDefault(_entityAttributes);

require("./style.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchCard = function (_Component) {
    _inherits(SearchCard, _Component);

    function SearchCard(props) {
        _classCallCheck(this, SearchCard);

        var _this = _possibleConstructorReturn(this, (SearchCard.__proto__ || Object.getPrototypeOf(SearchCard)).call(this, props));

        _this.toggleCollapse = function () {
            var current = _this.state.collapsed;
            _this.setState({ collapsed: !current });
        };

        _this.renderButtons = function () {
            var action = void 0,
                actionFunc = void 0;
            var url = '/explore/entity/' + encodeURIComponent(_this.props.id);
            if (_this.props.currentProject && _this.props.currentProject.graphData && _this.props.currentProject.graphData.nodes && _this.props.currentProject.graphData.nodes.some(function (e) {
                return e.id === _this.props.id;
            })) {
                action = "link";
                actionFunc = function actionFunc() {
                    return _this.props.graph.translateGraphAroundId(_this.props.id);
                };
            } else {
                action = "add";
                actionFunc = function actionFunc() {
                    return _this.props.dispatch((0, _graphActions.addToGraphFromId)(_this.props.graph, _this.props.id));
                };
            }
            return _react2.default.createElement(
                "div",
                { className: "d-flex" },
                _react2.default.createElement(
                    "div",
                    { className: "icon-div" },
                    _react2.default.createElement(
                        "i",
                        { className: "entity-icon add-to-graph-icon material-icons", onClick: actionFunc },
                        action
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "icon-div" },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: url },
                        _react2.default.createElement(
                            "i",
                            { className: "entity-icon detailed-view-icon material-icons" },
                            "description"
                        )
                    )
                )
            );
        };

        var isDataReady = !props.shouldFetch || !isNaN(_this.props.id);
        var urlId = decodeURIComponent(_this.props.id).split("/");
        var urlName = urlId[urlId.length - 1];
        _this.state = {
            collapsed: true,
            data: isDataReady ? props.data : null,
            isDataReady: isDataReady,
            name: props.data.name ? props.data.name : urlName
        };
        return _this;
    }

    _createClass(SearchCard, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            if (!this.state.isDataReady) {
                server.getNode(this.props.id, false).then(function (d) {
                    _this2.setState({ isDataReady: true, data: d.nodes.filter(function (n) {
                            return n.id === _this2.props.id;
                        })[0] });
                }).catch(function (err) {
                    return console.log(err);
                });
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            var _this3 = this;

            if (this.props.id !== nextprops.id) {
                var isn = isNaN(nextprops.id);
                var sf = nextprops.shouldFetch;
                if (!(!sf || !isn)) {
                    // TODO refactor ready logic
                    server.getNode(nextprops.id, false).then(function (d) {
                        _this3.setState({ isDataReady: true, data: d.nodes.filter(function (n) {
                                return n.id === nextprops.id;
                            })[0] });
                    }).catch(function (err) {
                        return console.log(err);
                    });
                } else {
                    // If data isnt ready, set state
                    var urlId = decodeURIComponent(nextprops.id).split("/");
                    var urlName = urlId[urlId.length - 1];
                    this.setState({ name: nextprops.data.name ? nextprops.data.name : urlName, data: nextprops.data });
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            // TODO centralize
            if (!this.state.isDataReady) {
                return _react2.default.createElement(
                    "div",
                    { key: this.props.id },
                    " Loading ... "
                );
            }
            return _react2.default.createElement(
                "div",
                { className: "card result-card", key: this.props.id },
                _react2.default.createElement(
                    "div",
                    { className: "card-header result-card-header flex-row d-flex" },
                    this.renderButtons(),
                    _react2.default.createElement(
                        "span",
                        { className: "collapse-link", onClick: this.toggleCollapse },
                        this.state.data.name || this.state.data.combined || this.state.data.number || this.state.data.description
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "ml-auto card-program" },
                        this.props.data._type,
                        _react2.default.createElement(
                            "small",
                            { className: "card-sdn-type" },
                            this.props.data.dataset
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: this.state.collapsed ? 'collapse' : null },
                    _react2.default.createElement(
                        "div",
                        { className: "card-body result-card-body" },
                        _react2.default.createElement(_entityAttributes2.default, { node: this.state.data })
                    )
                )
            );
        }
    }]);

    return SearchCard;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(graphActions, dispatch),
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        currentProject: state.graph.currentProject
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SearchCard));