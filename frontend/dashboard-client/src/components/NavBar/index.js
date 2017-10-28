import React, { Component } from 'react';
import './App.css';

import AppBar from 'material-ui/AppBar';
import {Link} from 'react-router-dom';

class NavBar extends Component {

	goHome(event){
		
	}

	render () {
		return (
			<div >
				<AppBar onTitleTouchTap={this.goHome.bind(this)} title={<Link to="/" style={{color: 'inherit'}}>ArcherUX</Link>}/>                
			</div>
		);
	};
};

export default NavBar;
