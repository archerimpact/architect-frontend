import React, { Component } from 'react';

import './style.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import { withRouter } from 'react-router-dom';

const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};
const json = {
  "nodes": [{
      "name": "Not Evil Organization",
      "type": "organization",
      "architectId": "gs://archer-source-data/usa/ofac/sdn.json/4697",
      "registered_in": "Germany",
      "organization_type": "Nonprofit",
      "incorporation_date": "2017-04-20"
  }, {
      "name": "Evil Organization",
      "type": "organization",
      "architectId": "gs://archer-source-data/usa/ofac/sdn.json/4697/aka/EvilOrg"
  }, {
      "name": "DUDE, Some",
      "type": "person",
      "architectId": "gs://archer-source-data/usa/ofac/sdn.json/19388",
      "birthdate": "1966-10-10",
      "last_seen": "Somalia",
      "gender": "Male",
      "place_of_birth": "Russia"
  }],
  "relationships": [{
      "type": "AKA",
      "target": "gs://archer-source-data/usa/ofac/sdn.json/4697/aka/EvilOrg",
      "source": "gs://archer-source-data/usa/ofac/sdn.json/4697"
  }, {
      "type": "OWNED_BY",
      "target": "gs://archer-source-data/usa/ofac/sdn.json/4697/aka/EvilOrg",
      "source": "gs://archer-source-data/usa/ofac/sdn.json/19388"
  }]
};

class Entity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeData: null,
      relationshipData: null,
      graphData: null
    };
    this.renderPerson = this.renderPerson.bind(this);
    this.renderOrganization = this.renderOrganization.bind(this);
  }

  renderPerson(node, keys) {
    return (
      <div>
        <h2> {node.name} </h2>
        <p> {node.type} </p>
        <p> {node.architectId} </p>
        <p> {node.birthdate} </p>
        <p> {node.last_seen} </p>
        <p> {node.gender} </p>
        <p> {node.place_of_birth} </p>
      </div>
    )
  }

  renderOrganization(node, keys) {
    return (
      <div>
        <div className="entity-header-wrapper">
          <div className="entity-header">
            <div className="entity-name">{node.name}</div>
            <div className="entity-type">({node.type})</div>
          </div>
          <div className="entity-source">OFAC Sanctions Data</div>
        </div>
        <hr />
        <div className="entity-body">
          <h5 className="text-center">Attributes</h5>
          { keys.map(k => {
              const val = node[k[0]];
              if (node[k[0]]) {
                return (
                  <div className="info-row" key={k}>
                    <p className="info-key">{k[1]}:</p>
                    { (!(val instanceof Array))
                      ? <p className="info-value">{val}</p>
                      : <p>list</p>
                    }
                  </div>
                )
              }
          }) }
          {/*
            if (node.connections) {
              <h4>Connections</h4>
              node.connections.map(c => )
            }
          */}
        </div>
      </div>
    )
  }
  
  render() {
    const keys = [
      ['registered_in', 'Registered In'],
      ['birthdate', 'Date of Birth'],
      ['gender', 'Gender'],
      ['place_of_birth', 'Place of Birth'],
      ['last_seen', 'Last Seen'],
      ['incorporation_date', 'Incorporation Date']
    ];

    if (this.state.nodeData == null || this.state.relationshipData == null) {
      return (
        <div className="entity-container">
         {this.type === "person"
            ? this.renderPerson(json.nodes[2], keys) 
            : this.renderOrganization(json.nodes[2], keys) 
          }
        </div>
      );
    } else {
      return (
        <div>
          {/* <EntityCard nodeItem={this.state.nodeData[0]} /> */}
          {/* <hr></hr>
          <SummaryInfo nodeItem={this.state.nodeData[0]} nodeRelationships={this.state.relationshipData} /> */}
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  return {
    currentNode: state.currentNode
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
