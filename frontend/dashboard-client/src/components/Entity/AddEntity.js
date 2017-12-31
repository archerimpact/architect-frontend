import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class AddEntity extends Component {
	constructor(props){
		super(props);
		this.state = {
			nameFieldValue: '',
			typeFieldValue: '',
			tagFieldValue: '',
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleNameFieldChange = this.handleNameFieldChange.bind(this);
		this.handleTypeFieldChange = this.handleTypeFieldChange.bind(this);
		this.handleTagFieldChange = this.handleTagFieldChange.bind(this);
	};

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.onEntitySubmit({name: this.state.nameFieldValue, type: this.state.typeFieldValue, link: "", tags: [this.state.tagFieldValue], sources: [], projectid: this.props.projectid});
		this.setState({
			nameFieldValue: '',
			typeFieldValue: '',
			tagFieldValue: '',
		});
	};

	handleNameFieldChange(event) {
		this.setState({
			nameFieldValue: event.target.value
		});
	};

	handleTypeFieldChange(event) {
		this.setState({
			typeFieldValue: event.target.value
		});
	};

	handleTagFieldChange(event) {
		this.setState({
			tagFieldValue: event.target.value
		});
	};

	render() {
		return(
			<div>			
				<TextField 
					value={this.state.nameFieldValue} 
					floatingLabelText="Name"
					hintText="e.g. Alice Ma"
					onChange={this.handleNameFieldChange}
					style={{width: 250, marginRight: 20}}/>
				<TextField
					floatingLabelText="Type"
					hintText="e.g. Person"
					onChange={this.handleTypeFieldChange}
					style={{width: 250, marginRight: 20}}
				/>
				<TextField 
					value={this.state.tagFieldValue} 
					floatingLabelText="Tag"
					hintText="e.g. Alice Ma"
					onChange={this.handleTagFieldChange}
					style={{width: 250, marginRight: 20}}
				/>
				<RaisedButton label="Add an Entity" onClick={this.handleSubmit} />
			</div>
		);
	};
};

export default AddEntity;