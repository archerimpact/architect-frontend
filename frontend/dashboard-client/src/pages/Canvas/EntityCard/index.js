import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
// import queryString from 'query-string';
import * as server from '../../../server'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../Canvas/Graph/graphActions';

import './style.css';

class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    let isDataReady = !props.shouldFetch || !isNaN(parseInt(this.props.id));
    this.state = {
      collapsed: true,
      id: props.data.id,
      data: isDataReady ? props.data : null,
      isDataReady: isDataReady
      // id: entity._id,
      // neo4j_id : entity._source !== null ? entity._source.neo4j_id : entity.metadata.id,
      // name : entity._source !== null ? entity._source.name : entity.data.name,
      // type : entity._source !== null ? entity._type : entity.metadata.labels[0],
      // jurisdiction : entity._source !== null ? entity._source.jurisdiction : entity.data.jurisdiction,
      // date_of_creation : entity._source !== null ? entity._source.date_of_creation :entity.data.date_of_creation,
      // source : entity._source !== null ? entity._source.self : entity.self,
      // company_status : entity._source !== null ? entity._source.company_status : entity.data.company_status,
      // nationality : entity._source !== null ? entity._source.nationality : entity.data.nationality,
    }
  }

  //search results: all data
  //Entity details:
    //aliases, 
    componentWillMount() {
      if (!this.state.isDataReady) {
        server.getNode(this.props.data.id)
        .then(data => {
          this.setState({isDataReady: true, data: data, nodes: data.nodes, links: data.links})
        })
        .catch(err => console.log(err));
      }
    }
  
  toggleCollapse() {
    const current = this.state.collapsed;
    this.setState({collapsed: !current});
  }

  renderButtons() {
    let action, actionFunc;
    const url = '/build/' + this.props.match.params.investigationId +'/entity/' + encodeURIComponent(this.props.id);
    if (this.props.currentProject && this.props.currentProject.graphData && this.props.currentProject.graphData.nodes) {
      if (this.props.currentProject.graphData.nodes.some(e => e.id === this.props.id)) {
        action = "link";
        actionFunc = ()=>this.props.graph.translateGraphAroundId(this.props.id);
      }
    } else {
      action = "add";
      actionFunc = ()=>this.props.actions.addToGraphFromId(this.props.graph, this.props.id);
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

    return (
      <div className="card result-card" key={this.props.data.id}>
        <div className="card-header result-card-header flex-row d-flex">
          {this.renderButtons()}
          <span className="collapse-link" onClick={this.toggleCollapse}>
            { this.props.data.name }
          </span>
          <small className="card-sdn-type">

          </small>

          <div className="ml-auto card-program">
              { this.props.data.type }
          </div>

        </div>
        <div className={ this.state.collapsed ? 'collapse' : null}>
            <div className="card-body result-card-body">
              {
                Object.keys(this.props.data).map(d => {
                  const val = this.props.data[d];
                  return <p>{d}</p>
                })
              }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntityCard));
