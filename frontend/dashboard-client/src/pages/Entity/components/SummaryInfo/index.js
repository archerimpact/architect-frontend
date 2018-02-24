import React, { Component } from 'react';

import './style.css'

import { Link } from 'react-router-dom';

class SummaryInfo extends Component {

  render(){
    var nodeItem = this.props.nodeItem;    
    return(    
      <div className="summaryInfo">
        <p>Address: <b>{nodeItem.data.address}</b></p>
        <p>Birth Date: <b>{nodeItem.data.date_of_birth}</b></p>
        <p>Nationality: <b>{nodeItem.data.nationality}</b> </p>
        <p>Occupation:  <b>{nodeItem.data.occupation}</b> </p>
        <br></br>
      </div>
    );     
  }
}

export default SummaryInfo;