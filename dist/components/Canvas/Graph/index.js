"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _redux = require("redux");

var _reactRouterDom = require("react-router-dom");

var _graphActions = require("../../../redux/actions/graphActions");

var graphActions = _interopRequireWildcard(_graphActions);

var _graphSidebarActions = require("../../../redux/actions/graphSidebarActions");

require("./graph.css");

require("./style.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var windowHeight = window.innerHeight;
var windowWidth = Math.max(window.innerWidth);

var Graph = function (_Component) {
    _inherits(Graph, _Component);

    function Graph() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Graph);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Graph.__proto__ || Object.getPrototypeOf(Graph)).call.apply(_ref, [this].concat(args))), _this), _this.fetchCurrentEntityFunc = function (d) {
            _this.props.dispatch((0, _graphSidebarActions.fetchCurrentEntity)(d));
        }, _this.expandNodeFromData = function (d) {
            _this.props.dispatch((0, _graphActions.addToGraphFromId)(_this.props.graph, d.id));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Graph, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _props = this.props,
                data = _props.data,
                graph = _props.graph,
                width = _props.width,
                height = _props.height,
                allowKeycodes = _props.allowKeycodes,
                displayMinimap = _props.displayMinimap;
            // this.props.dispatch(initializeCanvas(this.props.graph, this.props.width, this.props.height));

            graph.generateCanvas(width ? width : windowWidth, height ? height : windowHeight, this.refs.graphContainer, allowKeycodes);
            if (data.nodes.length !== 0) {
                graph.setData(0, this.makeDeepCopy(data.nodes), this.makeDeepCopy(data.links));
            } else {
                graph.setData(0, [], []);
            }
            graph.bindDisplayFunctions({
                expand: this.expandNodeFromData,
                node: this.fetchCurrentEntityFunc,
                save: null
            });

            if (displayMinimap === false) {
                graph.hideMinimap();
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            var graph = this.props.graph;

            graph.bindDisplayFunctions({
                expand: this.expandNodeFromData,
                node: this.fetchCurrentEntityFunc,
                save: null
            });
        }
    }, {
        key: "makeDeepCopy",
        value: function makeDeepCopy(array) {
            var newArray = [];
            array.map(function (object) {
                return newArray.push(Object.assign({}, object));
            });
            return newArray;
        }
    }, {
        key: "render",
        value: function render() {
            var _props2 = this.props,
                height = _props2.height,
                width = _props2.width,
                onMouseOver = _props2.onMouseOver;

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement("div", { ref: "graphContainer", style: { "height": height ? height : windowHeight + "px", "width": width ? width : windowWidth + "px" }, onMouseOver: onMouseOver })
            );
        }
    }]);

    return Graph;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        actions: (0, _redux.bindActionCreators)(graphActions, dispatch),
        dispatch: dispatch
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(Graph));