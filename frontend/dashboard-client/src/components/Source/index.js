import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const container_style = {
	height:"100%",
	width: "100%",
	margin: 20,
	textAlign: 'center',
	display: 'inline-block',
	padding: 10
};

//shows just a jpg
class Source extends Component {
	render() {
		return (
			<Paper style={container_style} zDepth={3}>
				<img src='http://www.webdomain.com.hk/gif/sampledoc/comhk.gif' style={{width: "90%"}}/>
			</Paper>
		);
	};
}

export default Source;