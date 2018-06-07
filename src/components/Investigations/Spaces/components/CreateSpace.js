import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../../redux/actions/projectActions';

import './style.css';

class CreateSpace extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      value: ""
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    this.props.actions.createProject(this.state.value);
    this.setState({value: ""});
    this.props.onSubmit();
  }

  render() {
    return (
      <div className="drop-down-menu">
        <div className="drop-down-title">Create a new space</div>
        <div className="drop-down-search">
          <input className="subtle-input" placeholder="Create a space" value={this.state.value} onChange={this.handleChange}></input>
        </div>
        <div className="submit-button" onClick={()=>{this.handleSubmit()}}>
          Create space
        </div>
      </div>
    ); 
  }    
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  return {
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateSpace));
