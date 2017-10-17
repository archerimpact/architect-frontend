import React, { Component } from 'react';
import '../App.css';

import AddEntity from './AddEntity.js'
import EntityList from './EntityList.js'
import NodeGraph from './NodeGraph.js'
import Document from './Document.js'

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';

class DocumentPage extends Component {

  render() {
    return (
      <div>  
        <div className="centered">
          <div id="summary">      
            <h1 id="hello"> Hong Kong Internet (Holding) Unlimited Document #1 </h1>
          </div>
          <AddEntity className="addentity"/>
        </div>
        <div className="document-entities">
          <div className="left-column">
            <Document />
          </div>

          <div className="middle-column">
            <EntityList entities={this.props.savedEntities.entities}/>
          </div>

          <div className="right-column">
            <Paper>
              <NodeGraph entities= {this.props.savedEntities.entities}/>
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}
 
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage)