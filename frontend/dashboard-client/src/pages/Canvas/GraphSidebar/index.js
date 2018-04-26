import React, { Component } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import Entity from '../Entity';
import Search from '../Search';
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
      <div>
        <div className="sidebar-collapse" onClick={() => this.props.dispatch(actions.toggleSidebar())}>
          <p>&#9656;</p>
        </div>
        { !this.props.sidebarVisible ?
          null :
          <div className="search-side-container">
            <div className="search-side">
              <div className="search-bar">
                <DatabaseSearchBar/>
              </div>
              {this.state.renderSearch ? <Search graph={this.props.graph} search={this.props.search} entity/> : null}
              {this.state.renderEntity ? <Entity /> : null}
            </div>
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
