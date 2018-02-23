import React, { Component } from 'react';

import './style.css'

import { Link } from 'react-router-dom';

import Grade from 'material-ui/svg-icons/action/grade';
import Add from 'material-ui/svg-icons/content/add';

class EntityCard extends Component {

  render(){
    const actionButtons = (
      <div className="actions">
        <Grade/>
        <Add/>
      </div>
    )
    var nodeItem = this.props.nodeItem
    if (typeof(nodeItem) ==='undefined') {
      return (
        <div></div>
      );
    }
    else if (nodeItem.metadata.labels[0]==='person'){
      return(    
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + nodeItem.metadata.id}><h2 className="titleText">{nodeItem.data.name}</h2></Link>
            </div>      
            {actionButtons}
          </div>
          <i>Person</i>
          <div className="identifyingInfo">
            <div className="info">{nodeItem.data.nationality} </div>
          </div>
        </div>
      );
    } else if (nodeItem.metadata.labels[0]==='corporation'){
      return (
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + nodeItem.metadata.id}><h2 className="titleText">{nodeItem.data.name}</h2></Link>
            </div>
            <div className="status">
              {nodeItem.data.company_status}
            </div>
            {actionButtons}
          </div>
          <i>Company</i>
          <div className="identifyingInfo">
            <div>{nodeItem.data.nationality} </div>
            <div className="info">{"Jurisdiction: " + nodeItem.data.jurisdiction}</div>
            <div className="info">{"Date Created: " + nodeItem.data.date_of_creation}</div>
          </div>
        </div>
      );
    } else if (nodeItem.metadata.labels[0]==='Document'){
      return (
        <div className="outerBox">
          <h2 className="titleText">Document</h2>
          {actionButtons}
          <p>{"GCS Self: " + nodeItem.data.self}</p>
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