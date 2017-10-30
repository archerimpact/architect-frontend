import React, { Component } from 'react';
import AddProject from './addProject';
import ActionHome from 'material-ui/svg-icons/action/home';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';

import { Link } from 'react-router-dom';

class ProjectList extends Component {
	constructor() {
		super();
		this.state = {
			projects: [],
		};
		this.addProject = this.addProject.bind(this);
		this.projectList = this.projectList.bind(this);
	}

  addProject(freshProject) {
		var projects = this.state.projects;
		var moreProjects = projects.concat(freshProject);
		this.setState({projects: moreProjects});
	}

	projectList() {
		const projectItems = this.state.projects.map((project) => {
			return (
				<ListItem 
					className="projectName" 
					key={project} primaryText={project} 
					leftIcon={<ActionHome color={blue500} hoverColor={red500}/>}
				/>
				);
			});
		return projectItems;
	}

    render() {
    	if (this.props.status === 'isLoading') {
    		return (<div className="projects">
    					<p> Loading ... </p>
    				</div>
    			);
    	} else {
    		return (
	        	<div className="projects">
		        	<List className="list">
		        		{this.projectList(this.props.projects)}
		        	</List>
		        	<AddProject submit={(freshProject)=>this.addProject(freshProject)}>
		        	</AddProject>
	        	</div>
	        	);
    	} 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

function mapStateToProps(state) {
	if (state.data.savedProjects.status === 'isLoading') {
		return {
			status: state.data.savedProjects.status,
	    };
	} else {
	    return {
			status: state.data.savedProjects.status,
	        projects: state.data.savedProjects.projects,
	    };
	}
}

export default ProjectList