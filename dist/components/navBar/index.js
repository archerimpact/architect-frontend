"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./style.css");

var _reactRouterDom = require("react-router-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NavBar = function (_Component) {
    _inherits(NavBar, _Component);

    function NavBar(props) {
        _classCallCheck(this, NavBar);

        var _this = _possibleConstructorReturn(this, (NavBar.__proto__ || Object.getPrototypeOf(NavBar)).call(this, props));

        _this.handleClickOutside = function (event) {
            var targetClass = event.target.className;
            if (targetClass === 'nav-dropbtn') {
                return _this.toggleDropdown();
            } else {
                if (_this.state.dropdownShow === 'block' && targetClass !== 'nav-dropdown-content-button' && targetClass !== 'nav-link drop-nav-link') {
                    _this.setState({ dropdownShow: 'none' });
                }
                return true;
            }
        };

        _this.toggleDropdown = function () {
            var newShow = '';
            if (_this.state.dropdownShow === 'none') {
                newShow = 'block';
            } else {
                newShow = 'none';
            }
            _this.setState({ dropdownShow: newShow });
            return true;
        };

        _this.state = {
            dropdownShow: 'none',
            visible: true
        };
        return _this;
    }

    _createClass(NavBar, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            // let currentPath = this.props.location.pathname;
            // if (this.exploreCanvasPath.test(currentPath) || this.buildCanvasPath.test(currentPath)) {
            // 	this.setState({ visible: false });
            // }
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }

        // componentWillReceiveProps(nextProps){
        // 	let currentPath = nextProps.location.pathname;
        // 	// if (currentRoutes.pathname === '/explore/:sidebarState?"' || currentRoutes.pathname === '/build/:investigationId') {
        // 	if (this.exploreCanvasPath.test(currentPath) || this.buildCanvasPath.test(currentPath)) {
        // 		this.setState({ visible: false });
        // 	} else {
        // 		this.setState({ visibility: true });
        // 	}
        // }

    }, {
        key: "render",
        value: function render() {
            var authenticated = _react2.default.createElement(
                "nav",
                { className: "navbar navbar-expand-lg navbar-dark bg-primary" },
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { className: "navbar-brand", to: "/" },
                    _react2.default.createElement(
                        "span",
                        { className: "architect" },
                        "Archer"
                    )
                ),
                _react2.default.createElement(
                    "button",
                    { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarColor02" },
                    _react2.default.createElement("span", { className: "navbar-toggler-icon" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "collapse navbar-collapse", id: "navbarColor02" },
                    _react2.default.createElement(
                        "ul",
                        { className: "navbar-nav ml-auto" },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { className: "nav-item", activeClassName: "active-right-link", to: "/build" },
                            _react2.default.createElement(
                                "span",
                                { className: "nav-link" },
                                "Build"
                            )
                        ),
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { className: "nav-item", activeClassName: "active-right-link", to: "/explore" },
                            _react2.default.createElement(
                                "span",
                                { className: "nav-link" },
                                "Explore"
                            )
                        ),
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { className: "nav-item", activeClassName: "active-right-link", to: "/login" },
                            _react2.default.createElement(
                                "span",
                                { className: "nav-link", onClick: this.props.logOut },
                                "Log Out"
                            )
                        )
                    )
                )
            );

            var unauthenticated = _react2.default.createElement(
                "nav",
                { className: "navbar navbar-expand-lg navbar-dark bg-primary" },
                _react2.default.createElement(
                    _reactRouterDom.Link,
                    { className: "navbar-brand", to: "/" },
                    _react2.default.createElement(
                        "span",
                        { className: "architect" },
                        "Archer"
                    )
                ),
                _react2.default.createElement(
                    "button",
                    { className: "navbar-toggler", type: "button", "data-toggle": "collapse", "data-target": "#navbarColor02" },
                    _react2.default.createElement("span", { className: "navbar-toggler-icon" })
                ),
                _react2.default.createElement(
                    "div",
                    { className: "collapse navbar-collapse", id: "navbarColor02" },
                    _react2.default.createElement(
                        "ul",
                        { className: "navbar-nav ml-auto" },
                        _react2.default.createElement(
                            _reactRouterDom.NavLink,
                            { className: "nav-item", activeClassName: "active-right-link", to: {
                                    pathname: '/login',
                                    state: { from: this.props.location }
                                } },
                            _react2.default.createElement(
                                "span",
                                { className: "nav-link", onClick: this.props.logOut },
                                "Log In"
                            )
                        )
                    )
                )
            );

            return this.props.isAuthenticated ? authenticated : unauthenticated;
        }
    }]);

    return NavBar;
}(_react.Component);

;

exports.default = (0, _reactRouterDom.withRouter)(NavBar);