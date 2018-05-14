import React, { Component } from 'react';

import Entity from '../Entity';
import SearchResults from '../SearchResults';
import DatabaseSearchBar from '../../../components/SearchBar/databaseSearchBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter , Link} from 'react-router-dom';
import './style.css';
import * as actions from '../../../redux/actions';


class GraphSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderSearch: props.match.params ? props.match.params.sidebarState === "search" : null,
      renderEntity: props.match.params ? props.match.params.sidebarState === "entity" : null,
      history: [],
      listener: null
    };
    this.renderTabs = this.renderTabs.bind(this);
    this.renderSidebarContainer = this.renderSidebarContainer.bind(this);
  }

  componentDidMount() {
    let listener = this.props.history.listen((location, action) => {
      this.setState({ history: [...this.state.history, location] });
    })
    this.setState({listener: listener})
  }

  componentWillUnmount(){
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

  renderTabs() {
    let baseUrl = '/build/'+ this.props.match.params.investigationId;
    return (
      <div className="tabs" key="tabs">
        <div className="tab active-tab" onClick={() => {/* TODO */}}>
        <Link to={baseUrl + '/search'}>
          <i className="tab-icon material-icons">search</i>
        </Link>
        </div>
        <div className="tab" onClick={() => {/* TODO */}}>
        <Link to={baseUrl + '/list'}>
          <i className="tab-icon material-icons">list</i>
        </Link>
        </div>
        <div className="tab" onClick={() => {/* TODO */}}>
        <Link to={baseUrl + '/settings'}>
          <i className="tab-icon material-icons">settings</i>
        </Link>
        </div>
        <div className="tab" onClick={() => this.props.dispatch(actions.toggleSidebar())}>
          <i className="tab-icon material-icons">{this.props.sidebarVisible ? "chevron_right" : "chevron_left"}</i>
        </div>
      </div>
    )
  }

  renderSidebarContainer() {
    switch(this.props.match.params.sidebarState) {
      case "search":
        return  (
          <div style={{flex: 1}}>
              <div className="searchbar-container">
                <DatabaseSearchBar graphid={this.props.graphid} search={this.props.search} showSettings={true}/>
              </div>

              <div className="results-container">
                <SearchResults graph={this.props.graph} search={this.props.search} entity />
              </div>
          </div>
         );
      case "entity":
          return <Entity />
      default:
        return <div> Sample text </div>
    };
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

function mapStateToProps(state, props) {
  return {
    sidebarVisible: state.data.sidebarVisible
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GraphSidebar));
