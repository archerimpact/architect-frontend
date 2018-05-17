import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
// import queryString from 'query-string';
import * as server from '../../../server'; 
import './style.css';

class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.toggleCollapse = this.toggleCollapse.bind(this);
    debugger
    this.state = {
      collapsed: true,
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
      if (this.props.shouldFetch) {
        server.getNode(this.props.data.id)
        .then(data => {
          debugger
          this.setState({data: data})
        })
        .catch(err => console.log(err))
      }
    }

  toggleCollapse() {
    const current = this.state.collapsed;
    this.setState({collapsed: !current});
  }


  render() {
    // TODO centralize
    const url = '/build/' + this.props.match.params.investigationId +'/entity/' + this.props.data.id;
    if (this.state.data == null) {
      return <div> Loading ... </div>
    }
    return (
      <div className="card result-card" key={this.props.entity._id}>
        <div className="card-header result-card-header flex-row d-flex">
          <i className="entity-icon add-to-graph-icon material-icons" onClick={()=>{this.props.addToGraph(this.state.id)}}>add</i>
          <Link to={url}>
            <i className="entity-icon detailed-view-icon material-icons">format_list_bulleted</i>
          </Link>
          <span className="collapse-link" onClick={this.toggleCollapse}>
            { this.state.name }
          </span>
          <small className="card-sdn-type">
              
          </small>

          <div className="ml-auto card-program">
              { this.state.type }
          </div>

        </div>
        <div className={ this.state.collapsed ? 'collapse' : null}>
            <div className="card-body result-card-body">
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