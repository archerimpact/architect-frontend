import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import EntityBox from './EntityBox.js'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

class EntityList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			number: 6,
		}
	}

	render() {
		return (
			<div>
			{this.props.savedEntities.entities.map((entity) => {

			return (
				<div>
					<EntityBox name={entity.name} type={entity.type} link={entity.link} chips={entity.chips}/>
				</div>
				)
			})}
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList)
