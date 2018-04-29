import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import queryString from 'query-string';

import './style.css';

class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.fetchSearchQuery = this.fetchSearchQuery.bind(this);
    var entity = this.props.entity
    this.renderBody = this.renderBody.bind(this);
    //handle toggling and stuff in here
    this.state = {
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

  renderBody() {
    switch(this.state.type){
      case 'person':
        return  (<span className="identifyingInfo">
                  <span className="info">[United Kingdom Companies House Business Registry]</span>
                </span>)
      case 'corporation':
        return (<div className="identifyingInfo">
                <div>{this.state.nationality} </div>
                <div className="info">{"Jurisdiction: " + this.state.jurisdiction}</div>
                <div className="info">{"Date Created: " + this.state.date_of_creation}</div>
              </div>)
      case 'Document':
        return <p>{"GCS Self: " + this.state.source }</p>
      default:
        return <p>Data type not supported.</p>
    }
  }

  render() {
    return (
      <div className='entity-result' onClick={()=>this.setState({toggled:!this.state.toggled})}>
      <div className="outerBox">
        <div className="heading">
          <div className="titleName underline">
            <Link to={this.state.link}>{this.state.name}</Link>
          </div>
          <i style={{marginRight: '8px'}}>{this.state.type}</i>
          <span className="identifyingInfo">
              <span className="info">[United Kingdom Companies House Business Registry]</span>
            </span>
            <div className="status">
              {this.state.company_status}
            </div>
          {this.renderBody(this.state.type)}
        </div>
      </div>
      {/* {this.state.toggled?<SummaryInfo entity={this.props.entity}/>: null } */}
      </div>
    )
  }
}
export default withRouter(EntityCard);