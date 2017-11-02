import React, { Component } from 'react';
import EntityCard from './EntityCard';
import './style.css';
class EntitiesList extends Component {
	constructor(props){
		super(props);
		this.sortByProperty = this.sortByProperty.bind(this)
	}

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

	sortByProperty(prop, reverse) {
	  	return function(a, b) {
		    if (prop === null || typeof a[prop] !== 'string') {
		     	return reverse ? (b - a): (a - b);
		    }
		    if (typeof a[prop] === 'number') {
		     	return reverse ? (b[prop] - a[prop]): (a[prop] - b[prop]);
		    }
		    if (a[prop] < b[prop]) {
		     	return reverse ? 1 : -1;
		    }
		    if (a[prop] > b[prop]) {
		      	return reverse ? -1 : 1;
		    }
	    	return 0;
	  	}
	}
		

	render() {
		return (
			<div>
				{this.props.entities.slice().reverse()
					.sort(this.sortByProperty(this.props.sortBy.property, this.props.sortBy.reverse))
					.filter(entity => this.props.searchTerm === null || entity.name.includes(this.props.searchTerm))
					.map((entity, id) => {
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
