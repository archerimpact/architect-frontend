import React, {Component} from "react";
import SearchResults from "../searchResults";
import SearchBar from "../../searchBar";
import ListData from "../listData"
import {Link,withRouter} from "react-router-dom";
import {connect} from "react-redux";
import Entity from "../entity";
import {toggleSidebar} from "../../../redux/actions/graphActions"

import "./style.css";

class GraphSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderList: props.match.params ? props.match.params.sidebarState === "list" : false,
            renderSearch: props.match.params ? props.match.params.sidebarState === "search" : false,
            renderEntity: props.match.params ? props.match.params.sidebarState === "entity" : false,
            history: [],
            listener: null,
            // projectName: "",
            // author: "",
            // description: ""
        };
    }

    componentWillMount() {
        let listener = this.props.history.listen((location, action) => {
            this.setState({history: [...this.state.history, location]});
        });
        this.setState({listener: listener})
    }

    componentWillUnmount() {
        this.state.listener();
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.location.pathname !== nextprops.location.pathname) {
            this.setState({
                renderList: nextprops.match.params ? nextprops.match.params.sidebarState === "list" : false,
                renderSearch: nextprops.match.params ? nextprops.match.params.sidebarState === "search" : false,
                renderEntity: nextprops.match.params ? nextprops.match.params.sidebarState === "entity" : false
            })
        }
    }

    goToSearchPage = (query) => {
        let newPathname = '/explore/search/' + query;
        this.props.history.push(newPathname);
    };


    goToListPage = (query) => {
        let newPathname = '/explore/list/' + query;
        this.props.history.push(newPathname);
    };

    renderSearch() {
        const { graph, data } = this.props;
        return (
            <div>
                <SearchResults graph={graph} entity data={data}/>
            </div>
        )
    }

    renderList() {
        const { graph, data } = this.props;
        return (<ListData graph={graph} data={data}/>)
    }

    renderEntity() {
        return (
            <Entity graph={this.props.graph} id={this.props.match.params.query} data={this.props.data}/>
        )
    }

    toggleSidebarFunc = (tabName) => {
        const doNothing = () => {};
        if (tabName === "toggleSidebar") {
            this.props.dispatch(toggleSidebar());
        } else {
            !this.props.sidebarVisible ? this.props.dispatch(toggleSidebar()) : doNothing()
        }
    };

    renderTabs = () => {
        let baseUrl = '/explore';
        const activeState = this.props.match.params.sidebarState;

        return (
            <div className="tabs" key="tabs">
                <div className={"mt-auto tab " + (activeState === 'search' ? 'active-tab' : '')} onClick={() => this.toggleSidebarFunc("search")}>
                    <Link to={baseUrl + '/search'}>
                        <div>
                            <i className="tab-icon material-icons">search</i>
                        </div>
                    </Link>
                </div>
                <div className={"tab " + (activeState === 'entity' ? 'active-tab' : '')} onClick={() => this.toggleSidebarFunc("entity")}>
                    <Link to={baseUrl + '/entity'}>
                        <div>
                            <i className="tab-icon material-icons">description</i>
                        </div>
                    </Link>
                </div>
                <div className={"tab " + (activeState === 'list' ? 'active-tab' : '')} onClick={() => this.toggleSidebarFunc("list")}>
                    <Link to={baseUrl + '/list'}>
                        <div>
                            <i className="tab-icon material-icons">list</i>
                        </div>
                    </Link>
                </div>
                <div className="mb-auto tab" onClick={() => this.toggleSidebarFunc("toggleSidebar")}>
                    <i className="tab-icon toggle-tab-icon material-icons">{this.props.sidebarVisible ? "chevron_right" : "chevron_left"}</i>
                </div>
            </div>
        )
    }


    render() {
        const { sidebarVisible, isCovered, match } = this.props;
        return (
            <div className={"sidebar " + (sidebarVisible ? "slide-out" : "slide-in") + (isCovered ? " hidden" : "")}>
                <div className="flex-row d-flex full-height">
                    {this.renderTabs()}
                    <div className="sidebar-container" key="sidebar-container">
                        <div className="searchbar-container">
                            {
                                this.state.renderList ?
                                <SearchBar onSubmit={this.goToListPage} value={match.params.sidebarState === "list" && match.params.query ? match.params.query : ""} showSettings={true} placeholder={'Search entities in this project'}/>
                                    :
                                    null
                            }
                            {
                                this.state.renderSearch ?
                                    <SearchBar onSubmit={this.goToSearchPage} value={match.params.sidebarState === "search" && match.params.query ? match.params.query : ""} showSettings={true} placeholder={"Search Amnesty\'s database (e.g. 'xxx' or 'xxx')"}/>
                                    :
                                    null
                            }
                        </div>
                        <div className="full-width flex-column y-scrollable padding-on-bottom">
                            {
                                this.state.renderSearch ?
                                    this.renderSearch()
                                    : null
                            }
                            {
                                this.state.renderEntity ?
                                    this.renderEntity()
                                    : null
                            }
                            {
                                this.state.renderList ?
                                    this.renderList()
                                    : null
                            }
                        </div>
                    </div>
                </div>
                {/*{this.state.history.map((res, key) => (<div key={key}> {res.pathname + res.search} </div>))}*/}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        sidebarVisible: state.graph.sidebarVisible
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphSidebar));
