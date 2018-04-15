import React, { Component } from 'react';

import './style.css'

import EntityCard from '../../components/EntityCard/';
// import Neo4jGraphContainer from '../../components/NodeGraph/containers/Neo4jContainer/'
import DatabaseSearchBar from '../../components/SearchBar/databaseSearchBar'

import SummaryInfo from './components/SummaryInfo/';
import ConnectionsTab from './components/ConnectionsTab/';

import {Tabs, Tab} from 'material-ui/Tabs';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter } from 'react-router-dom';

const tab_style = {
  backgroundColor: '#FFFFFF',
  color:'#747474'
};

class Entity extends Component {

  constructor(props){
    super(props);
    this.state ={
      nodeData: null,
      relationshipData: null,
      graphData: null
    }
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount = () => {
    this.loadData(this.props.match.params.neo4j_id)
  }

  componentWillReceiveProps = (nextprops) => {
    if (this.props.match.params.neo4j_id !== nextprops.match.params.neo4j_id) {
      this.setState({
        nodeData: null,
        relationshipData: null,
        graphData: null
      })
      this.loadData(nextprops.match.params.neo4j_id) //load data when you change the url props
    }
  }

  loadData(neo4j_id) {
    server.getBackendNode(neo4j_id)
      .then(data => {
        //returns items in the format: [neo4j_data]
        this.setState({nodeData: data[0]})
      })
      .catch(err => {
        console.log(err)
      })
    server.getBackendRelationships(neo4j_id)
      .then(data => {
        /* neo4j returns items in this format: [connection, startNode, endNode] */

        this.setState({relationshipData: data})
      })
      .catch(err => {
        console.log(err)
      })
    server.getGraph(neo4j_id)
      .then(data => {
        /* neo4j returns items in this format: [connection, startNode, endNode] */
        this.setState({graphData: data})
      })
      .catch(err => {
        console.log(err)
      })
  }



  render(){
    if (this.state.nodeData== null || this.state.relationshipData == null || this.state.graphData==null) {
      return (
        <div>Loading</div>
      );
    } else {
      return(
        <div>
          <div className="search-side-container">
            <div className="search-side">
              <div className="search-bar">
                <DatabaseSearchBar/>
              </div>
              <div className="entityInfo">
                <EntityCard nodeItem={this.state.nodeData[0]} />
                <hr></hr>
                <SummaryInfo nodeItem={this.state.nodeData[0]} nodeRelationships={this.state.relationshipData}/>
                <div className="tabs" style={{width:'100%'}}>
                  <Tabs className="tab">
                    <Tab label={"Connections (" + this.state.relationshipData.length + ")"} type="default" style={tab_style}>
                      <div className="connections-tab">
                        <ConnectionsTab nodeRelationships={this.state.relationshipData}/>
                      </div>
                    </Tab>
                  </Tabs>
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
  return{
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
