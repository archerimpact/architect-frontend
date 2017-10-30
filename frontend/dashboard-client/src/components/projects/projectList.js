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
    return (
    	<div>
        <h3>Projects</h3>
        <Link to="/project/0" style={{color: 'inherit'}}>Go to Test Project</Link>
        <p></p>  
      	<AddProject
      		submit={(freshProject)=>this.addProject(freshProject)}>
      	</AddProject>
      	<List className="list">
      		{this.projectList()}
      	</List>
      </div>
    );
  }
}

export default ProjectList