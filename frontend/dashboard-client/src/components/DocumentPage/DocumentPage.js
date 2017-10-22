import React, { Component } from 'react';
//import '../App.css';
import './DocumentPage.css';

import AddEntity from './AddEntity.js'
import EntityList from './EntityList.js'
import NodeGraph from './NodeGraph.js'
import Document from './Document.js'

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';
import * as server from '../../server/';


class DocumentPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entities: this.props.savedEntities.entities,
      sourceid: this.props.match.params.id,
    }
    this.getEntities = this.getEntities.bind(this)
  }

  componentWillMount = () => {
        server.loadEntities()
            .then((data) => {
                this.props.dispatch(actions.addEntities(data.entities))
                this.props.dispatch(actions.addSources(data.notes))
        })
    }

  componentWillReceiveProps(nextProps) {
    this.setState({
      entities: nextProps.savedEntities.entities
    })
  }

  getEntities() {
    var sourceid = this.state.sourceid
    var entities = this.state.entities.filter(function (obj) {return obj.sources[0]=== sourceid})
    
    if (typeof(entities)==="undefined") {
      return []
    }
    else {return entities}
  }

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
            <EntityList entities={this.getEntities()}/>
          </div>

          <div className="right-column">
            <Paper>
              <NodeGraph entities={this.getEntities()} documents={[this.state.sourceid]}/>
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
        savedSources: state.data.savedSources
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage)