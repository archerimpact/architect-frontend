import React, { Component } from 'react';

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

import AddEntity from '../../components/Entity/AddEntity';
import EntityExtractor from '../../components/EntityExtractor/';

import * as server from '../../server/';
import * as actions from '../../redux/actions/';

const add_style = {
  marginRight: 20,
};

class AddInformation extends Component {
  constructor(props){
    super(props);
    this.onTextSubmit = this.onTextSubmit.bind(this);
    this.onEntitySubmit = this.onEntitySubmit.bind(this);
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
      actions.getProject(this.props.projectid);
      actions.getProjectEntities(this.props.projectid);
      actions.getProjectSources(this.props.projectid);
      actions.getPendingEntities(this.props.projectid);
    })
    .catch((error) => {
        console.log(error)
    });
  }

  onEntitySubmit() {

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
          <Paper >
            <div className="text-container">
              <EntityExtractor projectid={this.props.projectid} onTextSubmit ={this.onTextSubmit}/>
            </div>
            <AddEntity sourceid={0} projectid={this.props.projectid} onEntitySubmit ={this.onEntitySubmit}/>
          </Paper>
        </Popover>
      </div>
    );
  }
}

export default AddInformation;
          