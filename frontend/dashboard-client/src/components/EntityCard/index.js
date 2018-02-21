import React, { Component } from 'react';

import './style.css'

import SideBar from '../SideBar/'

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Grade from 'material-ui/svg-icons/action/grade';
import Add from 'material-ui/svg-icons/content/add';

import { Link } from 'react-router-dom';

class EntityCard extends Component {

  constructor(props){
    super(props);
    this.state ={
      open: false
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  };

  render(){
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
        onClick={this.handleClose}
      />,
    ];

    const actionButtons = (
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
          >
            <SideBar isAuthenticated={true}/>
          </Dialog>
        </ IconButton>
      </div>
    )
    var nodeItem = this.props.nodeItem
    if (typeof(nodeItem) ==='undefined') {
      return (
        <div></div>
      );
    }
    else if (nodeItem.metadata.labels[0]==='person'){
      return(    
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + nodeItem.metadata.id}><h2 className="titleText">{nodeItem.data.name}</h2></Link>
            </div>      
            {actionButtons}
          </div>
          <i>Person</i>
          <div idName="identifyingInfo">
            <div className="info">{nodeItem.data.nationality} </div>
          </div>
        </div>
      );
    } else if (nodeItem.metadata.labels[0]==='corporation'){
      return (
        <div className="outerBox">
          <div className="heading">
            <div className="titleName">
              <Link to={"/entity/" + nodeItem.metadata.id}><h2 className="titleText">{nodeItem.data.name}</h2></Link>
            </div>
            <div className="status">
              {nodeItem.data.company_status}
            </div>
            {actionButtons}
          </div>
          <i>Company</i>
          <div className="identifyingInfo">
            <div>{nodeItem.data.nationality} </div>
            <div className="info">{"Jurisdiction: " + nodeItem.data.jurisdiction}</div>
            <div className="info">{"Date Created: " + nodeItem.data.date_of_creation}</div>
          </div>
        </div>
      );
    } else if (nodeItem.metadata.labels[0]==='Document'){
      return (
        <div className="outerBox">
          <h2 className="titleText">Document</h2>
          {actionButtons}
          <p>{"GCS Self: " + nodeItem.data.self}</p>
        </div>
      );
    } else {
      return (
      <p>Data type not supported.</p>
      );
    }
  }
}

export default EntityCard;