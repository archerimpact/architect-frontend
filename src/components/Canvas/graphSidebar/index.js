import React, {Component} from "react";
import SearchResults from "../searchResults";
import SearchBarDatabase from "../../searchBarDatabase";
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

    toggleSidebarFunc = () => {
        this.props.dispatch(toggleSidebar());
    };

    renderSearch() {
        const { graphid, match, graph, data } = this.props;
        return (
            <div>
                <div className="searchbar-container">
                    <SearchBarDatabase graphid={graphid}
                                       search={(match.params.sidebarState === "search" && match.params.query ? match.params.query : "")}
                                       showSettings={true}/>
                    <div className="tab-container">
                        <button className="tab">Search</button>
                        <button className="tab">List</button>
                    </div>
                </div>
                <SearchResults graph={graph} entity data={data}/>
            </div>
        )
    }

    render() {
        const { sidebarVisible, isCovered, graph, data } = this.props;
        return (
            <div className={"sidebar " + (sidebarVisible ? "slide-out" : "slide-in") + (isCovered ? " hidden" : "")}>
                <div className="flex-row d-flex full-height">
                    <div className="sidebar-container" key="sidebar-container">
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
                        <div className="full-width full-height flex-column">
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
