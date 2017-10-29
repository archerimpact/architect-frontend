import React, { Component } from 'react';
import './ProjectPage.css'

import EntitiesTable from './EntitiesTable';
import EntityExtractor from './EntityExtractor';
import NodeGraph from '../SourcePage/NodeGraph';
import SourcesTable from '../SourcesTable';
import PDFUploader from '../pdf_uploader/pdfUploader';
import AddEntity from '../SourcePage/AddEntity'

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';
import * as server from '../../server/';

const tab_style = {
	backgroundColor: '#fafafa',
	color:'#747474'
};

class ProjectPage extends Component {
	componentWillMount = () => {
		server.loadEntities()
			.then((data) => {
				this.props.dispatch(actions.addEntities(data.entities))
				this.props.dispatch(actions.addSources(data.documents))
			}).catch((err) => console.log("There was an error: " + err))
	};

	render() {
		return (
			<div>
				<div className="header">
					<div className="header-text">
						<h3>{this.props.currentProject.title}</h3>
					</div>
					<div id="notifications">
						<Badge
						  badgeContent={10}
						  secondary={true}
						  badgeStyle={{top: 12, right: 12}}
						>
						  <IconButton tooltip="Notifications">
							<NotificationsIcon />
						  </IconButton>
						</Badge>
					</div>
				</div>
				<div className="tabs" style={{width:'100%', margin:'0 auto'}}>
					<Tabs >
						<Tab label="Workspace" type="default" style={tab_style}>
							<div className="graph-canvas">
								<Paper style={{width:"80%", margin:"0px auto", display:"flex"}}>
									<NodeGraph entities={this.props.savedEntities.entities} sources={this.props.savedSources.documents}/>
								</Paper>
                <Paper style={{position: "absolute"}}>
                  <div className="text-container">
                    <EntityExtractor/>
                  </div>
                  <AddEntity sourceid={0}/>
                </Paper>
							</div>
						</Tab>
						<Tab label={"Entities (" + this.props.savedEntities.entities.length + ")"} style={tab_style}>
							<div className="column">
								<Paper className="projects">
									<EntitiesTable />
								</Paper>
							</div>
						</Tab>
						<Tab label="Sources" style={tab_style}>
							<div className="column">
								<PDFUploader />
								<Paper className="projects">
									<SourcesTable />
								</Paper>
							</div>
						</Tab>
					</Tabs>
				</div>
			</div>
		);
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
		dispatch: dispatch,
	};
}

function mapStateToProps(state, props) {
	return {
		savedEntities: state.data.savedEntities,
		projects: state.data.projects,
		savedSources: state.data.savedSources,
		currentProject: state.data.projects[props.match.params.id]
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage);
