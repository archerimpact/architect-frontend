import React, { Component } from 'react';

import './style.css'

import { NavLink, Link, withRouter } from 'react-router-dom';

class NavBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			dropdownShow: 'none'
		};
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside(event) {
		let targetClass = event.target.className;
		if (targetClass === 'nav-dropbtn') {
			return this.toggleDropdown();
		} else {
			if (this.state.dropdownShow === 'block' && targetClass !== 'nav-dropdown-content-button' && targetClass !== 'nav-link drop-nav-link') {
				this.setState({ dropdownShow: 'none' });
			}
			return true;
		}
	}

	toggleDropdown() {
		let newShow = '';
		if (this.state.dropdownShow === 'none') {
			newShow = 'block';
		} else {
			newShow = 'none'
		}
		this.setState({ dropdownShow: newShow })
		return true
	}
	render() {
		const authenticated = (
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<Link className="navbar-brand" to="/">
					<span className="architect">ARCHITECT</span>
				</Link>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02">
	                <span className="navbar-toggler-icon"></span>
	            </button>

	            <div className="collapse navbar-collapse" id="navbarColor02">
	                <ul className="navbar-nav ml-auto">
	                	<NavLink className="nav-item" activeClassName="active-" to="/build">
							<span className="nav-link">Build</span>
						</NavLink>
						<NavLink className="nav-item" activeClassName="active-" to="/explore">
							<span className="nav-link">Explore</span>
						</NavLink>
						<NavLink className="nav-item" activeClassName="active-" to="/login">
							<span className="nav-link" onClick={this.props.logOut}>Log Out</span>
						</NavLink>
	                </ul>
	            </div>
	        </nav>
	    );

		const unauthenticated = (
	    	<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<Link className="navbar-brand" to="/">
					<span className="architect">ARCHITECT</span>
				</Link>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02">
	                <span className="navbar-toggler-icon"></span>
	            </button>

	            <div className="collapse navbar-collapse" id="navbarColor02">
	                <ul className="navbar-nav ml-auto">
						<NavLink className="nav-item" activeClassName="active-" to={{
							pathname: '/login',
							state: { from: this.props.location },
						}}>
							<span className="nav-link" onClick={this.props.logOut}>Log In</span>
						</NavLink>
	                </ul>
	            </div>
	        </nav>
	    )

	    return (
	    	<div>
	    		{ this.props.isAuthenticated ? authenticated : unauthenticated }
	    	</div>
	    );
	};
};

export default withRouter(NavBar);
