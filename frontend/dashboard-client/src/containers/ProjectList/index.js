import React, { Component } from 'react';
import AddProject from '../../components/Project/addProject';
import * as server_utils from '../../server/utils';
import * as actions from '../../redux/actions/';
import { Link } from 'react-router-dom';
import ActionHome from 'material-ui/svg-icons/action/home';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './style.css';

class ProjectList extends Component {
	constructor(props) {
		super(props);
		this.addProject = this.addProject.bind(this);
		this.projectList = this.projectList.bind(this);
	}

	componentDidMount() {
		this.props.actions.fetchProjects();
	}

	addProject(freshProject) {
		server_utils.addProject(freshProject);
		this.props.actions.fetchProjects();
	}

	projectList(projects) {
		const projectItems = Object.keys(projects).map((project) => {
			console.log(project)
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
		        	<h3>Projects</h3>
	                <Link to="/project/0" style={{color: 'inherit'}}>Go to Test Project</Link>
	                <p></p>  
	                <AddProject submit={(freshProject)=>this.addProject(freshProject)}>
	                </AddProject>
		        	<List className="list">
		        		{this.projectList(this.props.projects)}
		        	</List>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)