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
			tagFieldValue: '',
			chips: props.chips
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
		//let entity = entities.find(x => x.name === this.props.name)
		//const index = entities.indexOf(entity)
		//let newChip = this.state.tagFieldValue
		//entities[index] = Object.assign({}, entities[index])
		//entities[index].chips = entities[index].chips.concat([newChip])
		//console.log("new entity chips: " + newEntities[index].chips.map((entity) => {return entity}))

		this.props.dispatch(actions.addTag(entities, this.props.name, this.state.tagFieldValue))
		this.setState({
			tagFieldValue: ''
		})
	}

	handleRequestDelete() {
		return
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