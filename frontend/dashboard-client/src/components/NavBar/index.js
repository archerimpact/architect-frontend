import React, { Component } from 'react';

import './style.css'

import { Link, withRouter } from 'react-router-dom';

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
		debugger
    if (event.target.className !== 'nav-dropbtn' && this.state.dropdownShow === 'block') {
      this.setState({dropdownShow: 'none'});
    } else if (event.target.className === 'nav-dropbtn') {
			this.toggleDropdown();
		} else {
			return false
		}
  }

	toggleDropdown() {
		debugger
		let newShow = '';
		if (this.state.dropdownShow === 'none') {
			newShow = 'block';
		} else {
			newShow = 'none'
		}
		this.setState({dropdownShow: newShow})
	}
	render() {
		var self = this
		const Logged = withRouter(({ history }) => (
			<div className="right-buttons">
				<Link className="nav-link right-link" to="/explore">
					<span className="right-nav-link">Explore</span>
				</Link>
				<Link className="nav-link right-link" to="/projects">
					<span className="right-nav-link">Projects</span>
				</Link>
				<div className="nav-dropdown">
					<button className="nav-dropbtn" onClick={this.toggleDropdown}>Account</button>
					<div className="nav-dropdown-content" style={{display: this.state.dropdownShow}}>
						<a href="#">Projects</a>
						<button className="nav-dropdown-content-button" onClick={()=>{self.props.logOut()}}>Sign out</button>
					</div>
				</div>
			</div>
		));

		const Login = withRouter(({ history }) => (
			<button >
				<Link className="nav-link"  to={{
					pathname: '/login',
					state: { from: this.props.location }
				}}> Login </Link>
			</button>
		)
		);

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
