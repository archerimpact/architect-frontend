import React, { Component } from 'react';
import queryString from 'query-string';

import './style.css'

import { Link, withRouter } from 'react-router-dom';
class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.fetchSearchQuery = this.fetchSearchQuery.bind(this);
    this.state = {
      link: this.fetchSearchQuery()
    }
  }

  fetchSearchQuery() {
    let qs = queryString.parse(this.props.location.search).search;
    let path = this.props.location.pathname
    // let newEntity = this.props.nodeItem.metadata.id;
    let newEntity = this.props.nodeItem._source.neo4j_id;
    // this.props.history.push('/dresses?color=blue'+'?entity='+entity);
    let newQs = queryString.stringify({search: qs, entity: newEntity})
    return {
      pathname: path,
      search: newQs
    };
  }

  render(){
    var nodeItem = this.props.nodeItem
    if (typeof(nodeItem) ==='undefined' || nodeItem === null) {
      return (
        <div></div>
      );
    }
    // else if (nodeItem.metadata.labels[0]==='person'){
      else if (nodeItem._type==='person'){

      return(    
        <div className="outerBox">
          <div className="heading">
            <div className="titleName underline">
              <Link to={this.state.link}>{nodeItem._source.name}</Link>
            </div>      
          </div>
          <i>Person</i>
          <div className="identifyingInfo">
            <div className="info">[United Kingdom Companies House Business Registry]</div>
          </div>
        </div>
      );
     } else if (nodeItem._type==='corporation'){

    // } else if (nodeItem.metadata.labels[0]==='corporation'){
      return (
        <div className="outerBox">
          <div className="heading">
            <div className="titleName underline" onClick={this.updateSearchQuery}>
              <Link to={this.state.link}>{nodeItem._source.name}</Link>
            </div>
            <div className="status">
              {nodeItem._source.company_status}
            </div>
          </div>
          <i>Company</i>
          <div className="identifyingInfo">
            <div>{nodeItem._source.nationality} </div>
            <div className="info">{"Jurisdiction: " + nodeItem._source.jurisdiction}</div>
            <div className="info">{"Date Created: " + nodeItem._source.date_of_creation}</div>
          </div>
        </div>
      );
    } else if (nodeItem._type==='Document'){

    // } else if (nodeItem.metadata.labels[0]==='Document'){
      return (
        <div className="outerBox">
          <div className="titleName">
            Document
          </div>
          <p>{"GCS Self: " + nodeItem._source.self}</p>
        </div>
      );
    } else {
      return (
      <p>Data type not supported.</p>
      );
    }
  }
}
export default withRouter(EntityCard);
