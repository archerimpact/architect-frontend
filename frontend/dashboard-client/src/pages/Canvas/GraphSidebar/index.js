import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import Entity from '../Entity';
import Search from '../Search';
import DatabaseSearchBar from '../../../components/SearchBar/databaseSearchBar';
import { withRouter } from 'react-router-dom';

const urlPropsQueryConfig = {
  search: { type: UrlQueryParamTypes.string, queryParam: 'search' },
  entityid: { type: UrlQueryParamTypes.string, queryParam: 'entityid'},
  graphid: { type: UrlQueryParamTypes.string, queryParam: 'graphid'}
} 

class GraphSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderSearch: props.location.pathname === "/explore/search",
      renderEntity: props.location.pathname === "/explore/entity",
    };
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.location.pathname !== nextprops.location.pathname) {
      this.setState({
        renderSearch: nextprops.location.pathname === "/explore/search",
        renderEntity: nextprops.location.pathname === "/explore/entity",
      })
    }
  }

  render() {
    return (
      <div className="search-side-container">
        <div className="search-side">
          <div className="search-bar">
            <DatabaseSearchBar/>
          </div>
          {this.state.renderSearch ? <Search graph={this.props.graph} search={this.props.search} entity/> : null}
          {this.state.renderEntity ? <Entity /> : null}
        </div>
      </div>         
    );
  }
}
export default addUrlProps({ urlPropsQueryConfig })(withRouter(GraphSidebar));
