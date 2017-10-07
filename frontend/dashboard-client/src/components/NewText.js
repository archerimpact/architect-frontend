import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import RaisedButton from 'material-ui/RaisedButton';

class NewText extends Component{
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div id="summary">
				
				<h1 id="hello"> Document #1 </h1>
			</div>
		)
	}
}

export default NewText