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
		const Logged = withRouter(({ history }) => (
			<div className="right-buttons">
				<NavLink className="nav-link right-link" activeClassName="active-right-link" to="/explore">
					<span className="right-nav-link">Explore</span>
				</NavLink>
				<NavLink className="nav-link right-link" activeClassName="active-right-link" to="/projects">
					<span className="right-nav-link">Projects</span>
				</NavLink>
				<div className="nav-dropdown">
					<button className="nav-dropbtn" onClick={this.toggleDropdown}>Account</button>
					<div className="nav-dropdown-content" style={{ display: this.state.dropdownShow }}>
						<Link className="nav-link drop-nav-link" to="/projects" onClick={this.toggleDropdown}>Projects</Link>
						<button className="nav-dropdown-content-button" onClick={this.props.logOut}>Sign out</button>
					</div>
				</div>
			</div>
		));

		const Login = withRouter(({ history }) => (
			<button >
				<Link className="nav-link" to={{
					pathname: '/login',
					state: { from: this.props.location }
				}}> Login </Link>
			</button>
		)
		);



		const nav = (
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<Link className="navbar-brand" to="/">
					<span className="architect">ARCHITECT</span>
				</Link>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02">
	                <span className="navbar-toggler-icon"></span>
	            </button>

	            <div className="collapse navbar-collapse" id="navbarColor02">
	                <ul className="navbar-nav ml-auto">
	                	<NavLink className="nav-item" activeClassName="active-" to="/projects">
							<span className="nav-link">Build</span>
						</NavLink>
						<NavLink className="nav-item" activeClassName="active-" to="/explore">
							<span className="nav-link">Explore</span>
						</NavLink>
	                    <NavLink className="nav-item" activeClassName="active-" to="/projects">
							<span className="nav-link">My Account</span>
						</NavLink>
	                </ul>
	            </div>
	        </nav>
	    );

	    return nav;

		return (
			<div className="outerContainer">
				<Link className="nav-link" to="/">
					<span className="architect">ARCHITECT</span>
				</Link>
				{this.props.isAuthenticated ? <Logged logOut={this.props.logOut.bind(this)} /> : <Login logIn={this.props.logIn.bind(this)} />}
			</div>
		);
	};
};

export default NavBar;
