import React, { Component } from 'react';

import EntityCard from '../../../../../components/EntityCard/';
import SummaryInfo from '../../../Entity/components/SummaryInfo/';
import './style.css';

class EntityResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggled: false
    };
  }
  
  render() {
    return (
      <div className='entity-result' onClick={()=>this.setState({toggled:!this.state.toggled})}>
        <EntityCard 
          nodeItem={this.props.searchResultItem} 
          key={this.props.key} 
          newgraphid={this.props.newgraphid}
        />
        {this.state.toggled?<SummaryInfo nodeItem={this.props.searchResultItem}/>: null }
      </div>
    );
  }
}

export default EntityResult;