import React, {Component} from "react";

import Entity from "../Entity";
import SearchResults from "../SearchResults";
import ProjectData from "../ProjectData";
import DatabaseSearchBar from "../../../components/DatabaseSearchBar";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Link, withRouter} from "react-router-dom";
import "./style.css";
import * as actions from "../../../redux/actions/projectActions";


class GraphSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderSearch: props.match.params ? props.match.params.sidebarState === "search" : null,
            renderEntity: props.match.params ? props.match.params.sidebarState === "entity" : null,
            history: [],
            listener: null
        };
    }

    componentDidMount() {
        let listener = this.props.history.listen((location, action) => {
            this.setState({history: [...this.state.history, location]});
        })
        this.setState({listener: listener})
    }

    componentWillUnmount() {
        this.state.listener();
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.location.pathname !== nextprops.location.pathname) {
            this.setState({
                renderSearch: nextprops.match.params ? nextprops.match.params.sidebarState === "search" : null,
                renderEntity: nextprops.match.params ? nextprops.match.params.sidebarState === "entity" : null
            })
        }
    }

    renderTabs = () => {
        let baseUrl = '/build/' + this.props.match.params.investigationId;
        const activeState = this.props.match.params.sidebarState;

        return (
            <div className="tabs" key="tabs">
                <div className={"tab " + (activeState === 'search' ? 'active-tab' : '')}>
                    <Link to={baseUrl + '/search'}>
                        <div>
                            <i className="tab-icon material-icons">search</i>
                        </div>
                    </Link>
                </div>
                <div className={"tab " + (activeState === 'entity' ? 'active-tab' : '')}>
                    <Link to={baseUrl + '/entity'}>
                        <div>
                            <i className="tab-icon material-icons">description</i>
                        </div>
                    </Link>
                </div>
                <div className={"tab " + (activeState === 'list' ? 'active-tab' : '')}>
                    <Link to={baseUrl + '/list'}>
                        <div>
                            <i className="tab-icon material-icons">list</i>
                        </div>
                    </Link>
                </div>
                <div className={"tab " + (activeState === 'settings' ? 'active-tab' : '')}>
                    <Link to={baseUrl + '/settings'}>
                        <div>
                            <i className="tab-icon material-icons">settings</i>
                        </div>
                    </Link>
                </div>
                <div className="tab" onClick={() => this.props.dispatch(actions.toggleSidebar())}>
                    <i className="tab-icon material-icons">{this.props.sidebarVisible ? "chevron_right" : "chevron_left"}</i>
                </div>
            </div>
        )
    }

    renderSettings = () => {
        return (
            <div> Sample text </div>
        )
    }

    renderSidebarContainer = () => {
        switch (this.props.match.params.sidebarState) {
            case "search":
                return (
                    <div className="full-width full-height flex-column">
                        <div className="searchbar-container">
                            <DatabaseSearchBar graphid={this.props.graphid}
                                               search={(this.props.match.params ? this.props.match.params.query : null)}
                                               showSettings={true}/>
                        </div>
                        <SearchResults graph={this.props.graph} entity/>
                    </div>
                );
            case "entity":
                return <Entity graph={this.props.graph} id={this.props.match.params.query}/>
            case "list":
                return <ProjectData graph={this.props.graph}/>
            case "settings":
                return this.renderSettings();
        }
        ;
    }

    render() {
        return (
            <div className={"sidebar " + (this.props.sidebarVisible ? "slide-out" : "slide-in")}>
                <div className="flex-row d-flex full-height">
                    {this.renderTabs()}
                    <div className="sidebar-container" key="sidebar-container">
                        {this.renderSidebarContainer()}
                    </div>
                </div>
                {this.state.history.map((res, key) => (<div key={key}> {res.pathname + res.search} </div>))}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        sidebarVisible: state.project.sidebarVisible
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphSidebar));
