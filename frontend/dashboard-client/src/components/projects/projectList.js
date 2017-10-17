import React, { Component } from 'react';
import AddProject from './addProject';
import { List, ListItem} from 'material-ui/List';
import ActionHome from 'material-ui/svg-icons/action/home';
import {red500, yellow500, blue500} from 'material-ui/styles/colors';

class ProjectList extends Component {
	constructor() {
		super();
		this.state = {
			projects: ['Guns', 'Trump Conspiracies'],
		};
		this.addProject = this.addProject.bind(this);
	}

	addProject(freshProject) {
		console.log("AHH")
		var projects = this.state.projects;
		var moreProjects = projects.concat(freshProject);
		console.log(moreProjects)
		this.setState({projects: moreProjects});
	}

    render() {
    	const projectItems = this.state.projects.map((project) => {
			return (
				<ListItem className="projectName" key={project} primaryText={project} leftIcon={<ActionHome color={blue500} hoverColor={red500}/>} />
				//<Project key={project} name={project}></Project>
				);
			});
        return (
        	<div className="projects">
        	<List className="list">
        		{projectItems}
        	</List>
        	<AddProject
        		submit={(freshProject)=>this.addProject(freshProject)}>
        	</AddProject>
        	</div>
        	);
    }
}

export default ProjectList