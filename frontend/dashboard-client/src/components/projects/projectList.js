import React, { Component } from 'react';
import AddProject from './addProject';
import * as server_utils from '../../server/utils';
import ActionHome from 'material-ui/svg-icons/action/home';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';

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
		server_utils.addProject(freshProject);
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
        return (
        	<div className="projects">
	        	<List className="list">
	        		{this.projectList()}
	        	</List>
	        	<AddProject submit={(freshProject)=>this.addProject(freshProject)}>
	        	</AddProject>
        	</div>
        	);
    }
}

export default ProjectList