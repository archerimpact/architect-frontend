import React, {Component} from "react";
import {withRouter} from "react-router-dom";

import SearchBar from "../searchBar";

class SearchBarDatabase extends Component {

    goToSearchPage = (query) => {
        let newPathname = '/explore/search/' + query;
        this.props.history.push(newPathname);
    };

    render() {
        return (
            <SearchBar homeSearchContainerId={this.props.homeSearchContainerId} homeSearchInputId={this.props.homeSearchInputId} onSubmit={this.goToSearchPage} value={this.props.search} showSettings={this.props.showSettings} placeholder={'Search Entities, Programs, Filters (e.g. "Gertler", "EO13662", "Aircraft")'} isHomePage={this.props.isHomePage}/>
        );
    }
}
export default withRouter(SearchBarDatabase);
