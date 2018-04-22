import React, { Component } from 'react';

import './style.css';

import { Link } from 'react-router-dom';

class SummaryInfo extends Component {

  render(){
    var nodeItem = this.props.nodeItem;  
    var type, name, neo4j_id, jurisdiction, date_of_creation, source, company_status, address, date_of_birth, nationality, officer_role, occupation, appointed_on, resigned_on;
    if (nodeItem._source != null) {
      neo4j_id = nodeItem._source.neo4j_id;
      name = nodeItem._source.name;
      type = nodeItem._type;
      jurisdiction = nodeItem._source.jurisdiction;
      date_of_creation = nodeItem._source.date_of_creation;
      source = nodeItem._source.self;
      company_status = nodeItem._source.company_status;
      address = nodeItem._source.address
      date_of_birth = nodeItem._source.date_of_birth;
      nationality = nodeItem._source_nationality;
      officer_role = nodeItem._source.officer_role;
      appointed_on = nodeItem._source.appointed_on
      occupation = nodeItem._source.occupation
      resigned_on = nodeItem._source.resigned_on
    } else if (nodeItem.metadata != null) {
      neo4j_id = nodeItem.metadata.id;
      name = nodeItem.data.name;
      type = nodeItem.metadata.labels[0];
      jurisdiction = nodeItem.data.jurisdiction;
      date_of_creation = nodeItem.data.date_of_creation;
      source = nodeItem.self;
      company_status = nodeItem.data.company_status;
      address = nodeItem.data.address;
      date_of_birth = nodeItem.data.date_of_birth;
      nationality = nodeItem.data.nationality;
      officer_role = nodeItem.data.officer_role;
      appointed_on = nodeItem.data.appointed_on;
      occupation = nodeItem.data.occupation
      resigned_on = nodeItem.data.resigned_on

    }
    return(    
      <div className="summaryInfo">
        <p>Address: <b>{
          address ?
          address.address_line_1 + ", " + address.address_line_2 + ", " + address.locality
          : null }</b></p>
        <p>Birth Date: <b>{
          date_of_birth ?
          date_of_birth.month + "-" + date_of_birth.year
          : null }</b></p>
        <p>Nationality: <b>{nationality}</b> </p>
        <p>Occupation:  <b>{}</b> </p>
        <p>Officer role: <b>{officer_role}</b></p>
        <p>Appointed on: <b>{appointed_on}</b></p>
        <p>Resigned on: <b>{resigned_on}</b></p>
        <br></br>
      </div>
    );     
  }
}

export default SummaryInfo;