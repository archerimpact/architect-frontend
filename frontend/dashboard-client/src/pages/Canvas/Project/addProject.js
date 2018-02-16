import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Popover from 'material-ui/Popover';
import Paper from 'material-ui/Paper';

import './style.css';

class AddProject extends Component {
	constructor(props) {
		super(props);
		this.state = {value: '', open:false};
		this.newProject = this.newProject.bind(this);
    this.projectSubmit = this.projectSubmit.bind(this);
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

	newProject(event) {
		this.setState({value: event.target.value});
		event.preventDefault();
	}

    projectSubmit(event) {
        this.props.submit(this.state.value);
        this.setState({value: ''});
        event.preventDefault();
    }

    render() {
        return (
      <div style={{margin:"20px"}}>
        <FloatingActionButton secondary={true} onClick={this.handleTouchTap}>
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
          <div className="AddProject">
                <form onSubmit={this.projectSubmit}>
                <TextField
                  placeholder="Enter project name"
                  value={this.state.value}
                  onChange={this.newProject}
                  style={{marginRight: "20px"}}/>
                <RaisedButton 
                        primary={true} 
                        className="submit" 
                        type="submit"
                        label="Create Project" />
              </form>
                <p>{this.props.name}</p>
            </div>
          </Paper>
        </Popover>
      </div>
        );
    }
}

export default AddProject