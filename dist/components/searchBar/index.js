"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchBar = function (_Component) {
    _inherits(SearchBar, _Component);

    function SearchBar() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SearchBar);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call.apply(_ref, [this].concat(args))), _this), _this.submitSearch = function (e) {
            e.preventDefault();
            _this.props.onSubmit(_this.refs.query.value);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SearchBar, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.refs.query.value = this.props.value ? this.props.value : null;
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            if (this.props.value !== nextprops.value) {
                this.refs.query.value = nextprops.value;
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                "div",
                { className: "search-container" },
                _react2.default.createElement(
                    "div",
                    { id: this.props.homeSearchContainerId, className: "search-input-container" },
                    _react2.default.createElement(
                        "div",
                        { className: "d-flex flex-row full-height" },
                        _react2.default.createElement(
                            "form",
                            { className: "search-form", onSubmit: function onSubmit(e) {
                                    return _this2.submitSearch(e);
                                } },
                            _react2.default.createElement("input", { id: this.props.homeSearchInputId,
                                className: "search-input",
                                ref: "query",
                                type: "text",
                                placeholder: this.props.placeholder
                            })
                        ),
                        _react2.default.createElement(
                            "i",
                            { id: "search-icon", className: "searchbar-icon mr-auto material-icons",
                                onClick: function onClick(e) {
                                    return _this2.submitSearch(e);
                                } },
                            "search"
                        )
                    )
                )
            );
        }
    }]);

    return SearchBar;
}(_react.Component);

exports.default = SearchBar;