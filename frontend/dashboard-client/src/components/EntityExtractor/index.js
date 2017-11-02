import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import * as server from '../../server/';

class EntityExtractor extends Component{
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.state = {
			text: "",
			title:""
		};
	};

	handleTextChange(event) {
		this.setState({text: event.target.value});
	};

	handleTitleChange(event) {
		this.setState({title: event.target.value});
	};

	handleSubmit(event) {
		event.preventDefault();
		this.props.onTextSubmit(this.state.title, this.state.text, this.props.projectid)
		this.setState({text:""})
	};

	render() {
		return(
			<div>
				<TextField
					hintText="Include a title for your text"
					value={this.state.title}
					onChange={this.handleTitleChange}
          style={{width: 250, marginRight: 20}}
				/>
				<TextField 
					multiLine={true} 
					rowsMax={10}
					hintText="Submit text to extract entities" 
					value={this.state.text} 
					onChange={this.handleTextChange} 
          style={{width: 250, marginRight: 20}}
				/>
				<RaisedButton label="Extract" onClick={this.handleSubmit}/>
			</div>
		);
	};
}

export default EntityExtractor;