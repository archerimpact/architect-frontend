import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import "./style.css";

import SearchBar from "../searchBar";

class SearchBarDatabase extends Component {

    goToSearchPage = (query) => {
        let newPathname = '/explore/search/' + query;
        this.props.history.push(newPathname);
    };

    render() {
        return (
            <SearchBar homeSearchContainerId={this.props.homeSearchContainerId} homeSearchInputId={this.props.homeSearchInputId} onSubmit={this.goToSearchPage} value={this.props.search} showSettings={this.props.showSettings} placeholder={'Search Entities (e.g. "Russia", "Kony", or "DPRK2")'}/>
        );
    }
}
export default withRouter(SearchBarDatabase);
