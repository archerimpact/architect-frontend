import React, { Component } from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import './style.css';

class AddConnection extends Component {
	const styles = {
		customWidth: {
			width: 200,
		},
	};

	constructor(props){
		super(props);
		this.state = {
			vertexOne: '',
			vertexTwo: '',
			description: '',
			idOne: '',
			idTwo: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleVertexOneChange = this.handleVertexOneChange.bind(this);
		this.handleVertexTwoChange = this.handleVertexTwoChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
	};

	componentDidMount() {
		this.props.actions.fetchVertices();
	}

	handleSubmit = (event) => {
		event.preventDefault();
		this.props.onConnectionSubmit({idOne: this.state.vertexOne._id, idTwo: this.state.vertexTwo._id, description: this.state.description, projectid: this.props.projectid});
		this.setState({
			vertexOne: '',
			vertexTwo: '',
			description: '',
		});
	};

	handleVertexOneChange(event, index, value) {
		this.setState({
			vertexOne: value,
		});
	};

	handleVertexTwoChange(event, index, value) {
		this.setState({
			vertexTwo: value,
		});
	};

	handleDescriptionChange(event) {
		this.setState({
			description: event.target.value
		});
	};

	render() {

		let vertexItems = [];
		if (this.props.status !== 'isLoading') {
			vertexItems = this.props.vertices.map((vertex) => {
				return <MenuItem value={vertex} primaryText={vertex.name} />;
			})
		}

		return(
			<span className="addConnection">	
				<h6>Vertex One</h6>
				<DropDownMenu
					value={this.state.vertexOne} 
					onChange={this.handleVertexOneChange}
					style={styles.customWidth}
          			autoWidth={false}>
					{vertexItems}
				</DropDownMenu>
				<h6>Vertex Two</h6>
				<DropDownMenu
					value={this.state.vertexTwo} 
					onChange={this.handleVertexTwoChange}
					style={styles.customWidth}
          			autoWidth={false}>
					{vertexItems}
				</DropDownMenu>
				<TextField 
					value={this.state.description} 
					floatingLabelText="Description"
					hintText="e.g. Member of"
					onChange={this.handleDescriptionChange}
					style={{width: 250, marginRight: 20}}
				/>
				<RaisedButton label="Add a Connection" onClick={this.handleSubmit} />
			</span>
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
	if (state.data.savedVertices.status === 'isLoading') {
	    return {
	     	status: state.data.savedVertices.status,
	     	}
	} else {
	    return {
	    	status: state.data.savedVertices.status,
	        vertices: state.data.savedVertices.vertices,
	    }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AddConnection);