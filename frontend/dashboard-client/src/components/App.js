import React, { Component } from 'react';
import './App.css';

import NavBar from './NavBar.js';
import { Link } from 'react-router-dom';

class App extends Component {
	render() {
		return (
			<div>
				<NavBar />
			</div>
		);
	};
}
 
export default App;