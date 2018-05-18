import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
// import queryString from 'query-string';
import * as server from '../../../server';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../Canvas/Graph/graphActions';

import EntityAttributes from '../EntityAttributes';

import './style.css';

class SearchCard extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    let isDataReady = !props.shouldFetch || !isNaN(parseInt(this.props.id));
    let urlId = decodeURIComponent(this.props.id).split("/");
    let urlName = urlId[urlId.length - 1];
    this.state = {
      collapsed: true,
      data: isDataReady ? props.data : null,
      isDataReady: isDataReady,
      name: props.data.name ? props.data.name : urlName
    }
  }

  componentWillMount() {
    if (!this.state.isDataReady) {
      server.getNode(this.props.id, false)
        .then(d => {
          let temp = d.nodes.filter(n => n.id === this.props.id)[0];
          this.setState({ isDataReady: true, data: temp })
          debugger;
        })
        .catch(err => console.log(err));
    }
  }

  toggleCollapse() {
    const current = this.state.collapsed;
    this.setState({ collapsed: !current });
  }

  renderButtons() {
    let action, actionFunc;
    const url = '/build/' + this.props.match.params.investigationId + '/entity/' + encodeURIComponent(this.props.id);
    if (this.props.currentProject && this.props.currentProject.graphData && this.props.currentProject.graphData.nodes && this.props.currentProject.graphData.nodes.some(e => e.id === this.props.id)) {
      action = "link";
      actionFunc = () => this.props.graph.translateGraphAroundId(this.props.id);
    } else {
      action = "add";
      actionFunc = () => this.props.actions.addToGraphFromId(this.props.graph, this.props.id);
    }
    return (
      <div>
        <i className="entity-icon add-to-graph-icon material-icons" onClick={actionFunc}>{action}</i>
        <Link to={url}>
          <i className="entity-icon detailed-view-icon material-icons">description</i>
        </Link>
      </div>
    )

  }

  render() {
    // TODO centralize
    if (!this.state.isDataReady) {
      return <div key={this.props.id}> Loading ... </div>
    }
    debugger
    return (
      <div className="card result-card" key={this.props.id}>
        <div className="card-header result-card-header flex-row d-flex">
          {this.renderButtons()}
          <span className="collapse-link" onClick={this.toggleCollapse}>
            {this.state.data._source.name || this.state.data._source.combined || this.state.data._source.number}
          </span>
          <small className="card-sdn-type">

          </small>

          <div className="ml-auto card-program">
            {this.props.data._type}
          </div>

        </div>
        <div className={this.state.collapsed ? 'collapse' : null}>
          <div className="card-body result-card-body">
            <EntityAttributes node={this.state.data._source} />
          </div>
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
    currentProject: state.data.currentProject,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchCard));
