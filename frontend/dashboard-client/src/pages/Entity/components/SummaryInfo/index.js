import React, { Component } from 'react';

import './style.css'

import { Link } from 'react-router-dom';

class SummaryInfo extends Component {

  render(){    
    return(    
      <div className="summaryInfo">
        <p>Address: <b>{this.props.nodeItem.data.address}</b></p>
        <p>Birth Date: <b>{this.props.nodeItem.data.date_of_birth}</b></p>
        <p>Nationality: <b>{this.props.nodeItem.data.nationality}</b> </p>
        <p>Occupation:  <b>{this.props.nodeItem.data.occupation}</b> </p>
        <br></br>
      </div>
    );     
  }
}

export default SummaryInfo;