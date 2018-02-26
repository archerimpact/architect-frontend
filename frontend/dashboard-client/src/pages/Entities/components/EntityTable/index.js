import React, { Component } from 'react';
import EntityRow from '../EntityRow';

import './style.css';

class EntityTable extends Component {

  constructor(props){
    super(props);
    this.sortByProperty = this.sortByProperty.bind(this)
  }

  sortByProperty(prop, reverse) {
  /* pass in the property you want to sort by of the entity, and whether or not to reverse the list as a boolean */
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
              <EntityRow 
                  onCreateEntity={this.props.onCreateEntity} 
                  onDeleteEntity={this.props.onDeleteEntity}
                  onEntityClick={this.props.onEntityClick} 
                  entity={entity} 
                  getSource={this.props.getSource}
                />
            );
          })}
      </div>
    );
  }
}
export default EntityTable
