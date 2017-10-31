import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
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
		server.submitText(this.state.title, this.state.text)
		.then((data) => {
			this.setState({text: ""});
		})
		.catch((error) => {
				console.log(error)
		});
	};

	render() {
		return(
			<div>
				<TextField
					hintText="Include a title for your text"
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<TextField 
					className="add-text" 
					multiLine={true} 
					rows={5} 
					rowsMax={10}
					hintText="Submit text to extract entities" 
					value={this.state.text} 
					onChange={this.handleTextChange} 
				/>
				<RaisedButton label="Extract" onClick={this.handleSubmit}/>
			</div>
		);
	};
}

export default EntityExtractor;