import React, { Component } from 'react';
import EntityCard from './EntityCard.js'

class EntitiesTab extends Component {
	render() {
		return (
			<div>
				{this.props.entities.slice().reverse().map((entity) => {
					return (
						<div>
							<EntityCard entity={entity}/>
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
        entityNames: state.data.entityNames,
        projects: state.data.projects,
        savedSources: state.data.savedSources
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(EntitiesTab)
