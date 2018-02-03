import React, { Component } from 'react';

import './style.css'

import EntitiesTab from '../../containers/EntityTab';
import NodeGraph from '../../components/NodeGraph';
import SourcesTab from '../../containers/SourcesTab';
import PDFUploader from '../../components/PDFUploader';
import AddInformation from '../../containers/AddInformation';

import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import * as server from '../../server/';

const tab_style = {
	backgroundColor: '#fafafa',
	color:'#747474'
};

class ProjectPage extends Component {

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
  					<Tabs >
  						<Tab label="Workspace" type="default" style={tab_style}>
  							<div className="graph-canvas">
  								<Paper style={{width:"80%", margin:"0px auto", display:"flex"}}>
  									<NodeGraph entities={this.props.savedEntities.entities} sources={this.props.savedSources.documents}/>
  								</Paper>

  							</div>
  						</Tab>
  						<Tab label={"Entities (" + this.props.savedEntities.entities.length + ")"} style={tab_style}>
  							<div className="column">
                  <h3>Your Entities</h3>
  								<Paper className="projects">
  									<EntitiesTab listType={"entities"} entities={this.props.savedEntities.entities} projectid={this.props.match.params.id}/>
  								</Paper>
  							</div>
  						</Tab>
  						<Tab label="Sources" style={tab_style}>
  							<div className="column">
  								<PDFUploader projectid={this.props.match.params.id}/>
  								<Paper className="projects">
  									<SourcesTab projectid={this.props.match.params.id}/>
  								</Paper>
  							</div>
  						</Tab>
  					</Tabs>
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
  if (state.data.savedEntities.status === 'isLoading' || state.data.savedSources.status === 'isLoading') {
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
