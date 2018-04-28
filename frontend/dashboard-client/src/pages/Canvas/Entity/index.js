import React, { Component } from 'react';

import './style.css'

import EntityCard from '../../../components/EntityCard/';

import SummaryInfo from './components/SummaryInfo/';
import ConnectionsTab from './components/ConnectionsTab/';

import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import * as server from '../../../server/';
import { withRouter } from 'react-router-dom';

const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};

class Entity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeData: null,
      relationshipData: null,
      graphData: null
    }
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount = () => {
    let qs = queryString.parse(this.props.location.search);
    this.loadData(qs.entityid);
  }

  componentWillReceiveProps = (nextprops) => {
    let lastqs = queryString.parse(this.props.location.search);
    let qs = queryString.parse(nextprops.location.search);
    if (lastqs.entityid !== qs.entityid) {
      this.setState({
        nodeData: null,
        relationshipData: null,
      })
      this.loadData(qs.entityid) //load data when you change the url props
    }
  }

  loadData(neo4j_id) {
    server.getBackendNode(neo4j_id)
      .then(data => {
        //returns items in the format: [neo4j_data]
        this.setState({ nodeData: data[0] })
      })
      .catch(err => {
        console.log(err)
      })
    server.getBackendRelationships(neo4j_id)
      .then(data => {
        /* neo4j returns items in this format: [connection, startNode, endNode] */

        this.setState({ relationshipData: data })
      })
      .catch(err => {
        console.log(err)
      })
  }



  render() {
    if (this.state.nodeData == null || this.state.relationshipData == null) {
      return (
        null
      );
    } else {
      return (
        <div>
          <div onClick={()=>this.props.history.goBack()}> Back to results </div>
          <EntityCard nodeItem={this.state.nodeData[0]} />
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
