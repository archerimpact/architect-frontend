import React, {Component} from "react";
import SearchResults from "../searchResults";
import DatabaseSearchBar from "../../../components/databaseSearchBar";
import {Link,withRouter} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from "../../../redux/actions/projectActions";
import { Radio } from 'antd';

import "./style.css";

class GraphSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderSearch: props.match.params ? props.match.params.sidebarState === "search" : null,
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
                renderSearch: nextprops.match.params ? nextprops.match.params.sidebarState === "search" : null,
            })
        }
    }

    toggleSidebarFunc = () => {
        this.props.dispatch(actions.toggleSidebar());
    };

    render() {
        console.log("this.props.match.params", this.props.match.params);
        console.log("this.props.match.params.query", this.props.match.params.query);
        return (
            <div className={"sidebar " + (this.props.sidebarVisible ? "slide-out" : "slide-in") + (this.props.isCovered ? " hidden" : "")}>
                <div className="flex-row d-flex full-height">
                    <div className="tabs" key="tabs">
                        <div className="tab" onClick={() => this.toggleSidebarFunc()}>
                            <i className="tab-icon material-icons">{this.props.sidebarVisible ? "chevron_right" : "chevron_left"}</i>
                        </div>
                    </div>
                    <div className="sidebar-container" key="sidebar-container">
                        <div className="full-width full-height flex-column">
                            <div className="searchbar-container">
                                <Radio.Group defaultValue="a" size="large">
                                    <Link to={'/explore/search'}>
                                        <Radio.Button value="a">
                                            Search
                                        </Radio.Button>
                                    </Link>
                                    <Link to={'/explore/list'}>
                                        <Radio.Button value="b">
                                            List
                                        </Radio.Button>
                                    </Link>
                                </Radio.Group>
                                <DatabaseSearchBar graphid={this.props.graphid}
                                                   search={(this.props.match.params ? this.props.match.params.query : null)}
                                                   showSettings={true}/>
                            </div>
                            <SearchResults graph={this.props.graph} entity/>
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
