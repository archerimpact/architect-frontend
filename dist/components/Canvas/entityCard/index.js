"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _reactRedux = require("react-redux");

var _graphActions = require("../../../redux/actions/graphActions");

var _graphSidebarActions = require("../../../redux/actions/graphSidebarActions");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityCard = function (_Component) {
    _inherits(EntityCard, _Component);

    function EntityCard(props) {
        _classCallCheck(this, EntityCard);

        var _this = _possibleConstructorReturn(this, (EntityCard.__proto__ || Object.getPrototypeOf(EntityCard)).call(this, props));

        _this.addToGraphFromIdFunc = function (graph, id) {
            if (!_this.props.data.nodes.some(function (e) {
                return e.id === _this.props.id;
            })) {
                _this.dispatch((0, _graphActions.addToGraphFromId)(graph, id));
            }
        };

        _this.dispatch = props.dispatch;
        return _this;
    }

    _createClass(EntityCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                node = _props.node,
                graph = _props.graph,
                data = _props.data;

            return _react2.default.createElement(
                "div",
                { className: "card result-card", key: node.id },
                _react2.default.createElement(
                    "div",
                    { className: "card-header result-card-header flex-row d-flex" },
                    _react2.default.createElement(
                        "div",
                        { className: "d-flex" },
                        _react2.default.createElement(
                            "div",
                            { className: "icon-div" },
                            _react2.default.createElement(
                                "i",
                                { className: "entity-icon add-to-graph-icon material-icons",
                                    onClick: function onClick() {
                                        return _this2.addToGraphFromIdFunc(graph, node.id);
                                    } },
                                "add"
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "span",
                        { className: "collapse-link", onClick: function onClick() {
                                return _this2.dispatch((0, _graphSidebarActions.fetchCurrentEntity)(node));
                            } },
                        node.name || node.combined || node.label || node.description
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "card-pills" },
                        !node || !node.programs ? null : _react2.default.createElement(
                            "div",
                            { className: "card-sdn-type" },
                            _react2.default.createElement(
                                "p",
                                { className: "sdn-type" },
                                node && node.programs && node.programs.join('/')
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    _react2.default.createElement("div", { className: "card-body result-card-body" })
                )
            );
        }
    }]);

    return EntityCard;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(EntityCard));