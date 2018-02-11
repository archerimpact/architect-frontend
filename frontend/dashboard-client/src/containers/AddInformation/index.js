import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';

import AddEntity from '../../components/Entity/AddEntity';
import AddConnection from '../../components/AddConnection';
import EntityExtractor from '../../components/EntityExtractor/';

import * as server from '../../server/';
import * as actions from '../../redux/actions/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const add_style = {
  marginRight: 20,
};

class AddInformation extends Component {
  constructor(props){
    super(props);
    this.onTextSubmit = this.onTextSubmit.bind(this);
    this.onEntitySubmit = this.onEntitySubmit.bind(this);
    this.onConnectionSubmit = this.onConnectionSubmit.bind(this);
    this.state = {
      open: false,
    };
  }               

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  onTextSubmit(title, text, projectid) {
    server.submitText(title, text, projectid)
    .then((data) => {
    this.setState({text: ""});
    this.props.actions.fetchProject(this.props.projectid);
    this.props.actions.fetchProjectSources(this.props.projectid);
    this.props.actions.fetchProjectEntities(this.props.projectid);
    })
    .catch((error) => {
        console.log(error)
    });
  }

  onEntitySubmit(entity) {
    this.props.actions.createEntity(entity);
  }

  onConnectionSubmit(connection) {
    this.props.actions.createConnection(connection);
  }

  render() {
    return(
      <div>
        <FloatingActionButton  mini={true} secondary={true} style={add_style} onClick={this.handleTouchTap}>
          <ContentAdd/>
        </FloatingActionButton>
        <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
          >
          <Paper className="add-container">
            <div className="text-container">
              <EntityExtractor projectid={this.props.projectid} onTextSubmit ={this.onTextSubmit}/>
            </div>
            <AddEntity sourceid={0} projectid={this.props.projectid} onEntitySubmit ={this.onEntitySubmit}/>
            <AddConnection sourceid={0} projectid={this.props.projectid} onConnectionSubmit ={this.onConnectionSubmit}/>
          </Paper>
        </Popover>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(AddInformation)          