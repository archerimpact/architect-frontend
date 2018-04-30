import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import queryString from 'query-string';

import './style.css';

class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.fetchSearchQuery = this.fetchSearchQuery.bind(this);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.addToGraph = this.addToGraph.bind(this);
    var entity = this.props.entity
    //handle toggling and stuff in here
    this.state = {
      collapsed: true,
      link: this.fetchSearchQuery(),
      neo4j_id : entity._source !== null ? entity._source.neo4j_id : entity.metadata.id,
      name : entity._source !== null ? entity._source.name : entity.data.name,
      type : entity._source !== null ? entity._type : entity.metadata.labels[0],
      jurisdiction : entity._source !== null ? entity._source.jurisdiction : entity.data.jurisdiction,
      date_of_creation : entity._source !== null ? entity._source.date_of_creation :entity.data.date_of_creation,
      source : entity._source !== null ? entity._source.self : entity.self,
      company_status : entity._source !== null ? entity._source.company_status : entity.data.company_status,
      nationality : entity._source !== null ? entity._source.nationality : entity.data.nationality,

    }
  }

  addToGraph() {
    this.props.fetch(this.state.neo4j_id);
  }

  toggleCollapse() {
    const current = this.state.collapsed;
    this.setState({collapsed: !current});
  }

  fetchSearchQuery() {
    let qs = queryString.parse(this.props.location.search);
    let newEntityid = this.props.entity._source ? this.props.entity._source.neo4j_id : this.props.entity.metadata.id
    let graphid = this.props.newgraphid ? newEntityid : qs.graphid;
    let newQs = queryString.stringify({search: qs.search, graphid: graphid, entityid: newEntityid})
    return {
      pathname: '/explore/entity',
      search: newQs
    };
  }

  render() {
    return (
      <div className="card" key={this.props.neo4j_id}>
        <div className="card-header">
          <i className="fa fa-share-alt add-to-graph-icon" onClick={this.addToGraph}></i>
          <a href="#" className="collapse-link" onClick={this.toggleCollapse}>
            { this.state.name }
          </a>
          <small className="card-sdn-type">
              
          </small>

          <div className="float-right card-program">
              { this.state.type }
          </div>

        </div>
        <div className={ this.state.collapsed ? 'collapse' : null}>
            <div className="card-body">
              <p>{ this.state.jurisdiction }</p>
              <p>{ this.state.date_of_creation }</p>
              <p>{ this.state.company_status }</p>
              <p>{ this.state.nationality }</p>
            </div>
        </div>
      </div>

    );
  }

}
export default withRouter(EntityCard);