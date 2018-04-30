import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import Entity from '../Entity';
import SearchResults from '../SearchResults';
import DatabaseSearchBar from '../../../components/SearchBar/databaseSearchBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import './style.css';
import * as actions from '../../../redux/actions';

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
      <div className="sidebar">
        <div className={"sidebar-collapse " + (this.props.sidebarVisible ? "sidebar-attached" : "edge-attached")} onClick={() => this.props.dispatch(actions.toggleSidebar())}>
          <span className={"collapse-icon fa " + (this.props.sidebarVisible ? "fa-angle-right" : "fa-angle-left")}></span>
        </div>

        { !this.props.sidebarVisible ?
          null :
          <div className="sidebar-container">
              <div className="searchbar-container">
                <DatabaseSearchBar/>
              </div>
              
              <div className="results-container">
                <SearchResults graph={this.props.graph} search={this.props.search} entity/>
              </div>
              

              {/*this.state.renderEntity ? <Entity /> : null */}
          </div>
        }     
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

function mapStateToProps(state, props) {
  return {
    sidebarVisible: state.data.sidebarVisible
  };
}

export default addUrlProps({ urlPropsQueryConfig })(withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphSidebar)));
