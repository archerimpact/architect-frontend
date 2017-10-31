import React, { Component } from 'react';
import EntityCard from './EntityCard';
import './style.css';
class EntitiesList extends Component {
	constructor(props){
		super(props);
		this.state = {
			entities: this.props.entities
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

	// var sorters = {
	//     byWeight : function(a,b) {
	//         return (a.weight - b.weight);
	//     },
	//     bySpeed : function(a,b) {
	//         return (a.topSpeed - b.topSpeed);
	//     },
	//     byPrice : function(a,b) {
	//         return (a.price - b.price);
	//     },
	//     byModelName : function(a,b) {
	//         return ((a.model < b.model) ? -1 : ((a.model > b.model) ? 1 : 0));
	//     },
	//     byMake : function(a,b) {
	//         return ((a.make < b.make) ? -1 : ((a.make > b.make) ? 1 : 0));
	//     }
	// };
	getEntitySort(a, b) {
		debugger
		switch(this.props.sortBy.by) {
			case 'dateAdded':
				return a-b;
			case 'type':
				return ((a.type < b.type) ? -1 : ((a.type > b.type) ? 1 : 0));	
			case 'source':
				return a-b;
			case 'name':
				return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));	
			default :
				return a-b
		}
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
