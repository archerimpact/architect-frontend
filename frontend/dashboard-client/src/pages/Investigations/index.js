import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import { Link, withRouter } from 'react-router-dom';
import { getProjects } from "../../server/index.js";

import InlineSVG from 'svg-inline-react';

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
			<div className="container y-scrollable">
				<h2 className="investigations-page-header">My Investigations</h2>
				{/*<p>{"All projects as JSON: " + JSON.stringify(this.state.projects)}</p>*/}
				<div className="row investigations-grid">
				{this.state.projects.map((proj) => {
					let image_blob;
								
					if (proj.img) {
						image_blob = proj.img;
					}
					else {
						image_blob = "no image provided";
					}

					return (
						<div key={proj._id} className='col-md-3'>
							<div className="card investigation-card">
								{/* <img className="card-img-top" src={image_blob} alt={"investigation-" + proj.name1}></img>*/}
									
								<div className="card-body investigation-card-body">
									<h5 className="card-title investigation-card-title text-center">{proj.name}</h5>
									<p className="card-text investigation-card-text">{proj.description}</p>
									<div className="text-center">
										<Link to={`/build/${proj._id}`}>
											<button className="btn btn-primary">
												Launch Investigation
											</button>
										</Link>
									</div>
								</div>	
							</div>
						</div>
					)
				})}
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
    isAuthenticated: state.data.user.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Investigations));