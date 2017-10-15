import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';


import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';


class AddEntity extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: false,
			nameFieldValue: '',
			typeFieldValue: '',
			linkFieldValue: '',
			tagFieldValue: '',
		};

	};

	handleTap = (e) => {
		e.preventDefault();
		this.props.dispatch(actions.addEntity({name: this.state.nameFieldValue, type: this.state.typeFieldValue, link:this.state.linkFieldValue, chips: [this.state.tagFieldValue]}))
		this.setState({
			open: true,
			anchorEl: e.currentTarget,
			nameFieldValue: '',
			typeFieldValue: '',
			linkFieldValue: '',
			tagFieldValue: '',
		});

	}

	handleClose = () => {
		this.setState({
			open: false,
		})
	}

	handleNameFieldChange = (e) => {
		this.setState({
			nameFieldValue: e.target.value
		});
	}
	handleTypeFieldChange = (e) => {
		this.setState({
			typeFieldValue: e
		});
	}

	handleLinkFieldChange = (e) => {
		this.setState({
			linkFieldValue: e.target.value
		});
	}

	handleTagFieldChange = (e) => {
		this.setState({
			tagFieldValue: e.target.value
		});
	}

	render() {
		return(
			<div>			
				<TextField 
					value={this.state.nameFieldValue} 
      				floatingLabelText="Name"
      				hintText="e.g. Alice Ma"
					onChange={this.handleNameFieldChange}
					style = {{width: 250, marginRight: 20}}/>
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
					style = {{width: 250, marginRight: 20}}/>

				{/* <TextField 
					value={this.state.linkFieldValue} 					
					floatingLabelText="Link"
					hintText="e.g. https://archerimpact.com"
					onChange={this.handleLinkFieldChange} 
					style = {{width: 250, marginRight: 20}}/> */}
				<RaisedButton label="Add an Entity" onClick = {this.handleTap} />

			</div>
		)
	}

}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        entityTypes: state.data.entityTypes,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEntity)