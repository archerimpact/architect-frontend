import React, { Component } from 'react';
import EntityBox from './EntityBox.js'

class EntityList extends Component {
	render() {
		return (
			<div>
				{this.props.entities.slice().reverse().map((entity) => {
					return (
						<div>
							<EntityBox entity={entity}/>
						</div>
					)
				})}
			</div>
		)
	}
}

export default EntityList
