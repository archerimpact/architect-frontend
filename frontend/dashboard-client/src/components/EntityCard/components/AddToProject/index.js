import React, { Component } from 'react'; 

import Project from '../Project/'

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Grade from 'material-ui/svg-icons/action/grade';
import Add from 'material-ui/svg-icons/content/add';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../../redux/actions/';
import * as server from '../../../../server/';
import {withRouter } from 'react-router-dom';

const customContentStyle = {
  width: '300px'
}

class AddToProject extends Component {

  constructor(props){
    super(props);
    this.state ={
      open: false,
      project: null
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleProjectSelect = this.handleProjectSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
    this.props.actions.fetchProjects();
  }

  handleClose() {
    this.setState({open: false});
  };

  handleProjectSelect(projectid) {
    this.setState({project: projectid})
  }

  handleSubmit(projectid) {
    this.props.actions.createEntity({name: this.props.entity.data.name, type: this.props.entity.metadata.labels[0], sources: [], projectid: projectid, neo4jid: this.props.entity.metadata.id})
    this.handleClose();
  }

  render(){
    if (this.props.status==='isLoading'){
      return(
        <div>Loading</div>
      )
    } else {
      const actions = [
        <FlatButton
          label="Cancel"
          primary={true}
          onClick={this.handleClose}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          keyboardFocused={true}
          onClick={()=>{this.handleSubmit(this.state.project)}}
        />,
      ];
      return(
        <div className="actions">
          <Grade/>
          <IconButton onClick={this.handleOpen}>
            <Add />
            <Dialog 
              actions={actions}
              title="Add to Project"
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
              contentStyle={customContentStyle}
            >
              {this.props.projects.map((project, key)=>{
                return (
                  <Project 
                    node={project} 
                    onProjectSelect={this.handleProjectSelect} 
                    key={key} 
                  />
                ); 
              })}
            </Dialog>
          </ IconButton>
        </div>
      );
    }
  }

};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  if (state.data.savedProjects.status === 'isLoading') {
    return {
      status: 'isLoading',
    }
  } else {
    return {
      status: 'isLoaded',
      projects: state.data.savedProjects.projects,
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddToProject));