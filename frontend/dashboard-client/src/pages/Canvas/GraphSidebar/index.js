import React, { Component } from 'react';

// import Entity from '../Entity';
import SearchResults from '../SearchResults';
import DatabaseSearchBar from '../../../components/SearchBar/databaseSearchBar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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
    return (
      <div className="tabs" key="tabs">
        <div className="tab active-tab" onClick={() => this.props.dispatch(actions.toggleSidebar())}>
          <span className="collapse-icon fa fa-search"></span>
        </div>
        <div className="tab" onClick={() => {/* TODO */}}>
          <span className="collapse-icon fa fa-ellipsis-v"></span>
        </div>
        <div className="tab" onClick={() => {/* TODO */}}>
          <span className="collapse-icon fa fa-cog"></span>
        </div>
        <div className="tab" onClick={() => {/* TODO */}}>
          <span className={"collapse-icon fa " + (this.props.sidebarVisible ? "fa-angle-right" : "fa-angle-left")}></span>
        </div>
      </div>
    )
  }

  renderSidebarContainer() {
    return (
      <div className="sidebar-container" key="sidebar-container">
        <div className="searchbar-container">
          <DatabaseSearchBar graphid={this.props.graphid} />
          <p>filter options go here</p>
          <hr className="no-bottom-margin" />
        </div>

        <div className="results-container">
          <SearchResults graph={this.props.graph} search={this.props.search} entity />
        </div>
        {this.state.history.map((res, key) => (<div key={key}> {res.pathname + res.search} </div>))}
        {/*this.state.renderEntity ? <Entity /> : null */}
      </div>
    );
  }

  render() {
    return (
      <div className={"sidebar " + (this.props.sidebarVisible ? "slide-out" : "slide-in")}>
        <div className="flex-row">
          {this.renderTabs()}
          {this.renderSidebarContainer()}
        </div>
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
