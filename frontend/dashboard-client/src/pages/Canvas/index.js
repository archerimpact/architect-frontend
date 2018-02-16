import React, { Component } from 'react';

import './style.css'

import NodeGraph from '../../components/NodeGraph';
import PDFUploader from '../../components/PDFUploader';
import AddInformation from '../../components/AddInformation';

import Paper from 'material-ui/Paper';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';
import {withRouter} from 'react-router-dom';
const tab_style = {
	backgroundColor: '#fafafa',
	color:'#747474'
};

class Canvas extends Component {

  componentDidMount = () => {
    this.props.actions.fetchProject(this.props.match.params.id);
    this.props.actions.fetchProjectEntities(this.props.match.params.id);
    this.props.actions.fetchProjectSources(this.props.match.params.id);
	};

	render() {
    if (this.props.status === 'isLoading') {
      return (<div className="projects">
            <p> Loading ... </p>
          </div>
        );
    } else {
      return (
  			<div>
  				<div className="header">
  					<div className="header-text">
  						<h3>{"Projects  >  " + this.props.currentProject.name}</h3>
  					</div>
  					<div id="notifications">
              <AddInformation projectid={this.props.match.params.id}/>
  					</div>
  				</div>
  				<div className="tabs" style={{width:'100%', margin:'0 auto'}}>
					  <div className="graph-canvas">
              <Paper style={{width:"80%", margin:"0px auto", display:"flex"}}>
                <NodeGraph entities={this.props.allEntities} sources={this.props.savedSources.documents}/>
              </Paper>
            </div>
  				</div>
  			</div>
      );
    };
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
		dispatch: dispatch,
	};
}

function mapStateToProps(state, props) {
  if (state.data.savedEntities.status === 'isLoading' || state.data.savedSources.status === 'isLoading' || state.data.pendingEntities.status === 'isLoading') {
    return {
      status: 'isLoading',
      currentProject: state.data.currentProject
    }
  } else {
    return {
      status: 'isLoaded',
      savedEntities: state.data.savedEntities,
      projects: state.data.projects,
      savedSources: state.data.savedSources,
      currentProject: state.data.currentProject,
      pendingEntities: state.data.pendingEntities,
      allEntities: state.data.pendingEntities.entities.concat(state.data.savedEntities.entities)
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Canvas));
