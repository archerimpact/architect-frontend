import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import Paper from 'material-ui/Paper';

const style = {
	height:"100%",
	width: "100%",
	margin: 20,
	textAlign: 'center',
	display: 'inline-block',
};

//shows just a jpg
class DocumentDisplay extends Component {



	render() {
		return (

			<div>
				<Paper style={style} zDepth={3}>
					<img src='http://www.webdomain.com.hk/gif/sampledoc/comhk.gif' id="banner" />
				</Paper>
			</div>
		)
	}

}

export default DocumentDisplay