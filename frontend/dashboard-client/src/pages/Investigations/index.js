import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import { getProjects } from "../../server/index.js";

import './style.css';

class Investigations extends Component {
	constructor(props) {
		super(props);
		this.state = {
			projects: [],
		};
	}

	componentDidMount() {
		getProjects().then(data => {
			this.setState({projects: data.message});
			console.log(this.state.projects);
		});
	}


	render() {
		return (
			<div>
				<p>{"All projects as JSON: " + JSON.stringify(this.state.projects)}</p>
				<ul>
				{this.state.projects.map((proj) => 
					<li key={proj._id}>
						<Link to={`/build/${proj._id}`}>
							{proj.name}
						</Link>
					</li>
				)}
				</ul>
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
    isAuthenticated: state.data.user.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Investigations));