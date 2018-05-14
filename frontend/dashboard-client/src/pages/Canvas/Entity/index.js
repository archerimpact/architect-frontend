import React, { Component } from 'react';

import './style.css'

// import EntityCard from '../../SearchResults/EntityCard';
import ConnectionsTab from './components/ConnectionsTab/';

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

  renderPerson(node) {
    return (
      <div>
        <p> {node.name} </p>
        <p> {node.type} </p>
        <p> {node.architectId} </p>
        <p> {node.birthdate} </p>
        <p> {node.last_seen} </p>
        <p> {node.gender} </p>
        <p> {node.place_of_birth} </p>
      </div>
    )
  }

  renderOrganization(node) {
    return (
      <div>
        <p> {node.name} </p>
        <p> {node.type} </p>
        <p> {node.architectId} </p>
        <p> {node.registered_in} </p>
        <p> {node.organization_type} </p>
        <p> {node.incorporation_date} </p>
      </div>
    )
  }
  render() {
    if (this.state.nodeData == null || this.state.relationshipData == null) {
      return (
        <div>
          <div style={{flex: 1}}> Entity </div>
         {this.type === "person" ? this.renderPerson(json.nodes[0]) 
            :
            this.renderOrganization(json.nodes[0]) 
          }

        </div>
      );
    } else {
      return (
        <div>
          <div onClick={()=>this.props.history.goBack()}> Back to results </div>
          {/* <EntityCard nodeItem={this.state.nodeData[0]} /> */}
          {/* <hr></hr>
          <SummaryInfo nodeItem={this.state.nodeData[0]} nodeRelationships={this.state.relationshipData} /> */}
          <div className="tabs" style={{ width: '100%' }}>
            <div className="tab">
              <div label={"Connections (" + this.state.relationshipData.length + ")"} type="default" style={tab_style}>
                <div className="connections-tab">
                  <ConnectionsTab nodeRelationships={this.state.relationshipData} />
                </div>
              </div>
            </div>
          </div>
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
