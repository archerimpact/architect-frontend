import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

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
		this.props.dispatch(actions.addEntity({name: this.state.nameFieldValue, type: this.state.typeFieldValue, link: "", tags: [this.state.tagFieldValue], sources: [this.props.sourceid]}));
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
			typeFieldValue: event
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
				<AutoComplete
					floatingLabelText="Type"
					hintText="e.g. Person"
					dataSource={this.props.entityTypes}
					onUpdateInput={this.handleTypeFieldChange}
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

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(actions, dispatch),
		dispatch: dispatch,
	};
};

function mapStateToProps(state) {
	return {
		savedEntities: state.data.savedEntities,
		entityTypes: state.data.entityTypes,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEntity);