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
	backgroundSize: 60,
	backgroundImage: "url('/daryus.jpg')",
};


class EntityBox extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: props.entity.name,
			type: props.entity.type,
			tagFieldValue: '',
			chips: props.entity.chips
		}
	};

	handleTagFieldChange = (value) => {
		console.log(value)
		this.setState({
			tagFieldValue: value
		});
	}

	handleTagSubmit = (e) => {	
		let entities = this.props.savedEntities.entities.slice();
		this.props.dispatch(actions.addTag(entities, this.state.name, this.state.tagFieldValue))
		this.setState({
			tagFieldValue: ''
		})
	}

	handleRequestDelete = (e) => {
		let entities = this.props.savedEntities.entities.slice();
		this.props.dispatch(actions.deleteTag(entities, this.state.name, this.children))
	}

	render() {
		return (
			<div>
				<Paper style={style}>
					<div className=	"entity-box">
						<Paper style={circle_style} circle={true}>
						</Paper>
						<div className="right-column">
							<b> {this.state.name} </b>
							<i> {this.state.type} </i>
							<a href={this.state.link} target="_blank">{this.state.link}</a>
							<div className="chips">
								{this.state.chips.map((chip) => {
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
			      				style={{width: 50, marginRight: 20}}
			    			/>
			    			<RaisedButton label="Add Tag" onClick={this.handleTagSubmit} />
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