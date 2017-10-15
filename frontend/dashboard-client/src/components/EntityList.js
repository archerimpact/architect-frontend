import React, { Component } from 'react';
import EntityBox from './EntityBox.js'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

class EntityList extends Component {
	render() {
		return (
			<div>
			{this.props.savedEntities.entities.slice().reverse().map((entity) => {

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
