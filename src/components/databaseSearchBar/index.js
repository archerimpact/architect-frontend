import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './style.css'

import SearchBar from '../searchBar';

class DatabaseSearchBar extends Component {

    goToSearchPage = (query) => {
        let buildCanvasPath = new RegExp('/build/\\S+');
        let newPathname = '';
        if (buildCanvasPath.test(this.props.location.pathname)) {
            newPathname = '/build/' + this.props.match.params.investigationId + '/search/' + query
        } else {
            newPathname = 'explore/search/' + query
        }
        this.props.history.push(newPathname);
    };

    render() {
        return (
            <SearchBar onSubmit={this.goToSearchPage} value={this.props.search} showSettings={this.props.showSettings}/>
        );
    }
}
export default withRouter(DatabaseSearchBar);