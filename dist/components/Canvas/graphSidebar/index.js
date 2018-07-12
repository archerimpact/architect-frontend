"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _searchResults = require("../searchResults");

var _searchResults2 = _interopRequireDefault(_searchResults);

var _searchBar = require("../../searchBar");

var _searchBar2 = _interopRequireDefault(_searchBar);

var _listData = require("../listData");

var _listData2 = _interopRequireDefault(_listData);

var _reactRouterDom = require("react-router-dom");

var _reactRedux = require("react-redux");

var _entity = require("../entity");

var _entity2 = _interopRequireDefault(_entity);

var _graphActions = require("../../../redux/actions/graphActions");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GraphSidebar = function (_Component) {
    _inherits(GraphSidebar, _Component);

    function GraphSidebar(props) {
        _classCallCheck(this, GraphSidebar);

        var _this = _possibleConstructorReturn(this, (GraphSidebar.__proto__ || Object.getPrototypeOf(GraphSidebar)).call(this, props));

        _this.goToSearchPage = function (query) {
            var newPathname = '/explore/search/' + query;
            _this.props.history.push(newPathname);
        };

        _this.goToListPage = function (query) {
            var newPathname = '/explore/list/' + query;
            _this.props.history.push(newPathname);
        };

        _this.toggleSidebarFunc = function (tabName) {
            var doNothing = function doNothing() {};
            if (tabName === "toggleSidebar") {
                _this.props.dispatch((0, _graphActions.toggleSidebar)());
            } else {
                !_this.props.sidebarVisible ? _this.props.dispatch((0, _graphActions.toggleSidebar)()) : doNothing();
            }
        };

        _this.renderTabs = function () {
            var baseUrl = '/explore';
            var activeState = _this.props.match.params.sidebarState;

            return _react2.default.createElement(
                "div",
                { className: "tabs", key: "tabs" },
                _react2.default.createElement(
                    "div",
                    { className: "mt-auto tab " + (activeState === 'search' ? 'active-tab' : ''), onClick: function onClick() {
                            return _this.toggleSidebarFunc("search");
                        } },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: baseUrl + '/search' },
                        _react2.default.createElement(
                            "div",
                            null,
                            _react2.default.createElement(
                                "i",
                                { className: "tab-icon material-icons" },
                                "search"
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "tab " + (activeState === 'entity' ? 'active-tab' : ''), onClick: function onClick() {
                            return _this.toggleSidebarFunc("entity");
                        } },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: baseUrl + '/entity' },
                        _react2.default.createElement(
                            "div",
                            null,
                            _react2.default.createElement(
                                "i",
                                { className: "tab-icon material-icons" },
                                "description"
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "tab " + (activeState === 'list' ? 'active-tab' : ''), onClick: function onClick() {
                            return _this.toggleSidebarFunc("list");
                        } },
                    _react2.default.createElement(
                        _reactRouterDom.Link,
                        { to: baseUrl + '/list' },
                        _react2.default.createElement(
                            "div",
                            null,
                            _react2.default.createElement(
                                "i",
                                { className: "tab-icon material-icons" },
                                "list"
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { className: "mb-auto tab", onClick: function onClick() {
                            return _this.toggleSidebarFunc("toggleSidebar");
                        } },
                    _react2.default.createElement(
                        "i",
                        { className: "tab-icon toggle-tab-icon material-icons" },
                        _this.props.sidebarVisible ? "chevron_right" : "chevron_left"
                    )
                )
            );
        };

        _this.state = {
            renderList: props.match.params ? props.match.params.sidebarState === "list" : false,
            renderSearch: props.match.params ? props.match.params.sidebarState === "search" : false,
            renderEntity: props.match.params ? props.match.params.sidebarState === "entity" : false,
            history: [],
            listener: null
            // projectName: "",
            // author: "",
            // description: ""
        };
        return _this;
    }

    _createClass(GraphSidebar, [{
        key: "componentWillMount",
        value: function componentWillMount() {
            var _this2 = this;

            var listener = this.props.history.listen(function (location, action) {
                _this2.setState({ history: [].concat(_toConsumableArray(_this2.state.history), [location]) });
            });
            this.setState({ listener: listener });
        }

        // componentDidMount() {
        //     const { match } = this.props;
        //     if (match.params && match.params.sidebarState === 'publish') {
        //         console.log("recognized that in publish space")
        //         let projId = match.params.query;
        //         if (projId != null) {
        //             console.log("recognized projId exists", projId);
        //             let res = this.props.dispatch(loadLink(projId));
        //             console.log("hi back in main", res)
        //             // this.setState({projectName: res.name, author: res.author, description: res.description})
        //         }
        //     }
        // }

    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            this.state.listener();
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextprops) {
            if (this.props.location.pathname !== nextprops.location.pathname) {
                this.setState({
                    renderList: nextprops.match.params ? nextprops.match.params.sidebarState === "list" : false,
                    renderSearch: nextprops.match.params ? nextprops.match.params.sidebarState === "search" : false,
                    renderEntity: nextprops.match.params ? nextprops.match.params.sidebarState === "entity" : false
                });
            }
        }
    }, {
        key: "renderSearch",
        value: function renderSearch() {
            var _props = this.props,
                graph = _props.graph,
                data = _props.data;

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(_searchResults2.default, { graph: graph, entity: true, data: data })
            );
        }
    }, {
        key: "renderList",
        value: function renderList() {
            var _props2 = this.props,
                graph = _props2.graph,
                data = _props2.data;

            return _react2.default.createElement(_listData2.default, { graph: graph, data: data });
        }

        // handleProjectNameChange = (val) => {
        //     this.setState({projectName: val})
        // }
        //
        // handleAuthorChange = (val) => {
        //     this.setState({author: val})
        // }
        //
        // handleDescriptionChange = (val) => {
        //     this.setState({description: val})
        // }
        //
        // handlePublishSubmit = async () => {
        //     const { projectName, author, description } = this.state;
        //     const { graph } = this.props;
        //     let res = await saveLink(projectName, author, description, graph)
        //     // modal popbox saying something or the antd popup
        // };
        //
        // renderPublish() {
        //     const { projectName, author, description } = this.state;
        //     return (
        //         <div>
        //             <Input placeholder="Project Name" value={projectName} onChange={(e) => this.handleProjectNameChange(e.target.value)}/>
        //             <Input placeholder="Author" value={author} onChange={(e) => this.handleAuthorChange(e.target.value)}/>
        //             <Input placeholder="Description" value={description} onChange={(e) => this.handleDescriptionChange(e.target.value)}/>
        //             <Button type="primary" onClick={() => this.handlePublishSubmit()}>Publish</Button>
        //         </div>
        //     )
        // }

    }, {
        key: "renderEntity",
        value: function renderEntity() {
            return _react2.default.createElement(_entity2.default, { graph: this.props.graph, id: this.props.match.params.query });
        }
    }, {
        key: "render",
        value: function render() {
            var _props3 = this.props,
                sidebarVisible = _props3.sidebarVisible,
                isCovered = _props3.isCovered,
                match = _props3.match;

            return _react2.default.createElement(
                "div",
                { className: "sidebar " + (sidebarVisible ? "slide-out" : "slide-in") + (isCovered ? " hidden" : "") },
                _react2.default.createElement(
                    "div",
                    { className: "flex-row d-flex full-height" },
                    this.renderTabs(),
                    _react2.default.createElement(
                        "div",
                        { className: "sidebar-container", key: "sidebar-container" },
                        _react2.default.createElement(
                            "div",
                            { className: "searchbar-container" },
                            this.state.renderList ? _react2.default.createElement(_searchBar2.default, { onSubmit: this.goToListPage, value: match.params.sidebarState === "list" && match.params.query ? match.params.query : "", showSettings: true, placeholder: 'Search entities in this project' }) : null,
                            this.state.renderSearch ? _react2.default.createElement(_searchBar2.default, { onSubmit: this.goToSearchPage, value: match.params.sidebarState === "search" && match.params.query ? match.params.query : "", showSettings: true, placeholder: 'Search Archer\'s OFAC database (e.g. "Russia", "Kony", or "DPRK2")' }) : null
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "full-width flex-column y-scrollable padding-on-bottom" },
                            this.state.renderSearch ? this.renderSearch() : null,
                            this.state.renderEntity ? this.renderEntity() : null,
                            this.state.renderList ? this.renderList() : null
                        )
                    )
                )
            );
        }
    }]);

    return GraphSidebar;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        sidebarVisible: state.graph.sidebarVisible
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(GraphSidebar));