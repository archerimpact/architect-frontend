"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Graph = require("./Graph");

var _Graph2 = _interopRequireDefault(_Graph);

var _GraphClass = require("./Graph/package/GraphClass");

var _GraphClass2 = _interopRequireDefault(_GraphClass);

var _graphSidebar = require("./graphSidebar");

var _graphSidebar2 = _interopRequireDefault(_graphSidebar);

var _sideNavBar = require("../sideNavBar");

var _sideNavBar2 = _interopRequireDefault(_sideNavBar);

var _publishButton = require("./publishButton");

var _publishButton2 = _interopRequireDefault(_publishButton);

var _bottomBar = require("../bottomBar");

var _bottomBar2 = _interopRequireDefault(_bottomBar);

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _graphActions = require("../../redux/actions/graphActions");

var _graphSidebarActions = require("../../redux/actions/graphSidebarActions");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    function Canvas(props) {
        _classCallCheck(this, Canvas);

        var _this = _possibleConstructorReturn(this, (Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call(this, props));

        _this.graph = new _GraphClass2.default();
        _this.baseUrl = '/explore';
        return _this;
    }

    _createClass(Canvas, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            // if (this.props.currentNode != null) {
            //   debugger;
            //     this.props.history.push(this.baseUrl + '/entity/' + encodeURIComponent(this.props.currentNode.id))
            // }

            if (this.props.match.params && this.props.match.params.sidebarState === 'search' && this.props.match.params.query != null) {
                this.props.dispatch((0, _graphActions.fetchSearchResults)(this.props.match.params.query));
            } else if (this.props.match.params && this.props.match.params.sidebarState === 'entity') {
                // this.props.dispatch(fetchEntity(decodeURIComponent(this.props.match.params.query)));
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            if (nextprops.currentNode != null && this.props.currentNode !== nextprops.currentNode) {
                this.props.history.push(this.baseUrl + '/entity/' + encodeURIComponent(nextprops.currentNode.id));
            }
            if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
                var nextQuery = nextprops.match.params.query;
                if (nextprops.match.params.sidebarState === 'search') {
                    if (nextQuery != null && this.props.match.params.query !== nextQuery) {
                        this.props.dispatch((0, _graphActions.fetchSearchResults)(nextQuery));
                    }
                } else if (nextprops.match.params.sidebarState === 'entity') {
                    if (nextQuery != null && this.props.match.params.query !== nextQuery) {
                        // this.props.dispatch(fetchEntity(decodeURIComponent(nextprops.match.params.query)));
                    }
                    if (nextprops.match.params.sidebarState !== 'entity' && this.props.currentNode !== null) {
                        this.props.dispatch((0, _graphSidebarActions.clearCurrentEntity)());
                    }
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                data = _props.data,
                isCovered = _props.isCovered,
                onMouseOver = _props.onMouseOver;

            return _react2.default.createElement(
                "div",
                { className: "canvas" },
                _react2.default.createElement(_sideNavBar2.default, null),
                _react2.default.createElement(_Graph2.default, { graph: this.graph, onMouseOver: onMouseOver, data: data, displayMinimap: false }),
                _react2.default.createElement(_graphSidebar2.default, { isCovered: isCovered, graph: this.graph, data: data }),
                _react2.default.createElement(_bottomBar2.default, null),
                _react2.default.createElement(_publishButton2.default, { graph: this.graph })
            );
        }
    }]);

    return Canvas;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        sidebarVisible: state.graph.sidebarVisible,
        currentNode: state.graphSidebar.currentEntity,
        data: state.graph.data
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Canvas));