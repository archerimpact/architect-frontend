import React, {Component} from "react";
import SearchResults from "../searchResults";
import SearchBar from "../../searchBar";
import ListData from "../listData"
import {Link,withRouter} from "react-router-dom";
import {connect} from "react-redux";
import { toggleSidebar } from "../../../redux/actions/graphActions"
import { Radio } from 'antd';

import "./style.css";

class GraphSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderList: props.match.params ? props.match.params.sidebarState === "list" : false,
            history: [],
            listener: null
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
            })
        }
    }

    renderSearch() {
        const { graph, data } = this.props;
        return (
            <div>
                <SearchResults graph={graph} entity data={data}/>
            </div>
        )
    }

    goToSearchPage = (query) => {
        let newPathname = '/explore/search/' + query;
        this.props.history.push(newPathname);
    };


    goToListPage = (query) => {
        let newPathname = '/explore/list/' + query;
        this.props.history.push(newPathname);
    };

    render() {
        const { sidebarVisible, isCovered, graph, data, match } = this.props;
        return (
            <div className={"sidebar " + (sidebarVisible ? "slide-out" : "slide-in") + (isCovered ? " hidden" : "")}>
                <div className="flex-row d-flex full-height">
                    <div className="sidebar-container" key="sidebar-container">
                        <div className="searchbar-container">
                            {
                                !this.state.renderList ?
                                <SearchBar onSubmit={this.goToSearchPage} value={match.params.sidebarState === "search" && match.params.query ? match.params.query : ""} showSettings={true} placeholder={'Search Database (e.g. "Russia", "Kony", or "DPRK2")'}/>
                                :
                                <SearchBar onSubmit={this.goToListPage} value={match.params.sidebarState === "list" && match.params.query ? match.params.query : ""} showSettings={true} placeholder={'Search Entity List (e.g. "Russia", "Kony", or "DPRK2")'}/>
                            }
                        </div>
                        <div className="tab-container">
                            <Link to="/explore/search">
                                <div className="tab">Search</div>
                            </Link>
                            <Link to="/explore/list">
                                <div className="tab">List</div>
                            </Link>
                        </div>
                        <div className="full-width flex-column">
                            {
                                !this.state.renderList ?
                                    this.renderSearch()
                                    :
                                    <ListData graph={graph} data={data}/>

                            }
                        </div>
                    </div>
                </div>
                {this.state.history.map((res, key) => (<div key={key}> {res.pathname + res.search} </div>))}
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
