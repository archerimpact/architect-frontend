import React, { Component } from 'react';

import './style.css'

import { Link } from 'react-router-dom';

class EntityCard extends Component {

  render(){
    if (this.props.nodeItem.metadata.labels[0]==='person'){
      return(    
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + this.props.nodeItem.metadata.id}><h2>{this.props.nodeItem.data.name}</h2></Link>
            </div>
          </div>
          <i>Person</i>
          <div idName="identifyingInfo">
            <div className="info">{this.props.nodeItem.data.nationality} </div>
          </div>
          <hr></hr>
        </div>
      );
    } else if (this.props.nodeItem.metadata.labels[0]==='corporation'){
      return (
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + this.props.nodeItem.metadata.id}><h2>{this.props.nodeItem.data.name}</h2></Link>
            </div>
            <div className="status">
              {this.props.nodeItem.data.company_status}
            </div>
          </div>
          <i>Company</i>
          <div className="identifyingInfo">
            <div>{this.props.nodeItem.data.nationality} </div>
            <div className="info">{"Jurisdiction: " + this.props.nodeItem.data.jurisdiction}</div>
            <div className="info">{"Date Created: " + this.props.nodeItem.data.date_of_creation}</div>
          </div>
          <hr></hr>
        </div>
      );
    } else if (this.props.nodeItem.metadata.labels[0]==='Document'){
      return (
        <div>
          <h2>Document</h2>
          <p>{"GCS Self: " + this.props.nodeItem.data.self}</p>
          <hr></hr>
        </div>
      );
    } else {
      return (
      <p>Data type not supported.</p>
      );
    }
  }
}

export default EntityCard;