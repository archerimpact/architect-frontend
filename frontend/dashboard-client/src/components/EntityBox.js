import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';


const style = {
	width: "100%",
	padding: 20,
	textAlign: 'center',
	display: 'inline-block',
};

const circle_style = {
	width: 60,
	height:60,
	margin: 20,
	textAlign: 'center',
	display: 'inline-block',
	backgroundImage: "url('/daryus.jpg')",
};


class EntityBox extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: props.name,
			type: props.type,
			tags: ["Alice Ma"],
			tagFieldValue: ''
		}
	};

	handleRequestDelete() {
		return
	}

	handleTagFieldChange = (value) => {
		this.setState({
			tagFieldValue: value
		});
	}

	handleSubmit = (e) => {	
		e.preventDefault();
		console.log(this.props.chips.concat(this.state.tagFieldValue))
		debugger
		this.props.dispatch(actions.addTag({name1: this.props.name, chips: this.props.chips.concat(this.state.tagFieldValue)}))
		this.setState({
			tagFieldValue: ''
		})
	}

	render() {
		return (
			<div>
				<Paper style={style}>
					<div className=	"entity-box">
						<Paper style={circle_style} circle={true}>
						</Paper>
						<div className="right-column">
							<b> {this.props.name} </b>
							<i> {this.props.type} </i>
							<a href={this.props.link} target="_blank">{this.props.link}</a>
							<div className="chips">
								{this.props.chips.map((chip) => {
									return (
										<Chip onRequestDelete={this.handleRequestDelete}> {chip} </Chip>
										)
								})}
							</div>
						    <AutoComplete
								floatingLabelText="Add Tags"
								hintText="e.g. Daryus"
			      				dataSource={this.props.entityNames}
			      				onUpdateInput={this.handleTagFieldChange}
			      				style={{width: 100, marginRight: 20}}
			    			/>
			    			<RaisedButton label="Add Tag" onClick={this.handleSubmit} />
						</div>
					</div>
				</Paper>
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
        entityNames: state.data.entityNames
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityBox)