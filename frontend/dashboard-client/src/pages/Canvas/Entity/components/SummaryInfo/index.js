import React, { Component } from 'react';

import './style.css';

import { Link } from 'react-router-dom';

class SummaryInfo extends Component {

  render(){
    var nodeItem = this.props.nodeItem;  
    return(    
      <div className="summaryInfo">
        <p>Address: <b>{
          nodeItem._source.address ?
          nodeItem._source.address.address_line_1 + ", " + nodeItem._source.address.address_line_2 + ", " + nodeItem._source.address.locality
          : null }</b></p>
        <p>Birth Date: <b>{
          nodeItem._source.date_of_birth ?
          nodeItem._source.date_of_birth.month + "-" + nodeItem._source.date_of_birth.year
          : null }</b></p>
        <p>Nationality: <b>{nodeItem._source.nationality}</b> </p>
        <p>Occupation:  <b>{nodeItem._source.occupation}</b> </p>
        <p>Officer role: <b>{nodeItem._source.officer_role}</b></p>
        <p>Appointed on: <b>{nodeItem._source.appointed_on}</b></p>
        <p>Resigned on: <b>{nodeItem._source.resigned_on}</b></p>
        <br></br>
      </div>
    );     
  }
}

export default SummaryInfo;