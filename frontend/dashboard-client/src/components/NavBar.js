import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';


class NavBar extends Component {
	render () {
		return (
			<div >
				<AppBar position="static"  />
			</div>
		)
	}
}

export default NavBar;
