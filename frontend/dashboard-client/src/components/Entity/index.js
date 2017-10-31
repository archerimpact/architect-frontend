import React, { Component } from 'react';
import EntityCard from './EntityCard';
import './style.css';
class EntitiesList extends Component {
	constructor(props){
		super(props);
		this.state = {
			entities: this.getEntityListSortedBy(props.sortBy)
		}
		this.getEntityListSortedBy = this.getEntityListSortedBy.bind(this)
		this.getEntitySort = this.getEntitySort.bind(this)
	}

	getEntityListSortedBy(sortBy) {
		switch(sortBy.by) {
			case 'dateAdded':
				return this.props.entities
			case 'type':
				console.log(sortBy.type);
				return
			default :
				return this.props.entities

		}
	}
	getEntitySort(a, b) {
		return a-b
	}
		

	render() {
		return (
			<div>
				{this.state.entities.slice().reverse().sort(this.getEntitySort).filter(entity => this.props.searchTerm === null || entity.name.includes(this.props.searchTerm)).map((entity, id) => {
					return (
						<div className="entityList" key={id}>
							<EntityCard onEntityClick={this.props.onEntityClick} entity={entity} getSource={this.props.getSource}/>
						</div>
					);
				})}
			</div>
		);
	}
}
export default EntitiesList
