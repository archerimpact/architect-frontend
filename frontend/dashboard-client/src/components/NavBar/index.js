import React, { Component } from 'react';

import AppBar from 'material-ui/AppBar';
import {Link} from 'react-router-dom';

class NavBar extends Component {

	render () {
		return (
			<div >
				<AppBar title={<Link to="/" style={{color: 'inherit'}}>ArcherUX</Link>}/>                
			</div>
		);
	};
};

export default NavBar;
