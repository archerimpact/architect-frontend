import React, { Component } from 'react';

import './style.css';

import AddProject from '../../components/Project/addProject';

import Folder from 'material-ui/svg-icons/file/folder';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';

import { Link } from 'react-router-dom';
import * as server_utils from '../../server/utils';
import * as actions from '../../redux/actions/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    const projectItems = projects.map((project) => {
      console.log("project: " + project)
      return (
      <Link to={"/project/" + project._id}>
        <ListItem 
          className="projectName" 
          key={project._id} primaryText={project.name} 
          leftIcon={<Folder color={blue500} hoverColor={red500}/>}
        />
      </Link>
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
      <div>
        <div>
      	   <div className="header">
              <AddProject submit={(freshProject)=>this.addProject(freshProject)} />
              <h1>Projects</h1>
            </div>
          <Divider />
        </div>
        <div>
        	<List className="list">
        		{this.projectList(this.props.projects)}
        	</List>
        </div>
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
      }
  } else {
      return {
      status: state.data.savedProjects.status,
          projects: state.data.savedProjects.projects,
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList)