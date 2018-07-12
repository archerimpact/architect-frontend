"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _entityCard = require("../entityCard");

var _entityCard2 = _interopRequireDefault(_entityCard);

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BackendSearch = function (_Component) {
    _inherits(BackendSearch, _Component);

    function BackendSearch() {
        _classCallCheck(this, BackendSearch);

        return _possibleConstructorReturn(this, (BackendSearch.__proto__ || Object.getPrototypeOf(BackendSearch)).apply(this, arguments));
    }

    _createClass(BackendSearch, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            if (this.props.searchData === null) {
                return _react2.default.createElement(
                    "div",
                    null,
                    "Loading..."
                );
            } else {
                return _react2.default.createElement(
                    "div",
                    { className: "search-results" },
                    this.props.searchData.map(function (entity) {
                        return _react2.default.createElement(_entityCard2.default, { key: entity.id, node: entity, data: _this2.props.data, graph: _this2.props.graph });
                    }),
                    this.props.searchData.length === 50 ? _react2.default.createElement(
                        "p",
                        { className: "paging-coming-soon" },
                        "(Showing top 50 results)"
                    ) : null
                );
            }
        }
    }]);

    return BackendSearch;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        searchData: state.graph.canvas.searchData
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(BackendSearch));