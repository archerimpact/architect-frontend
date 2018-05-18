import React, { Component } from 'react';

import './style.css'
import SearchCard from '../SearchCard';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../Graph/graphActions';

class BackendSearch extends Component {

  constructor(props) {
    super(props);
    this.toggleSearchResults = this.toggleSearchResults.bind(this);
    this.addToGraph = this.addToGraph.bind(this);
    this.saveCurrentProjectData = this.saveCurrentProjectData.bind(this);
    this.state = {
      showResults: true,
    };
  }

  toggleSearchResults() {
    return this.setState({ showResults: !this.state.showResults });
  }

  addToGraph(id) {
    this.props.actions.addToGraphFromId(this.props.graph, id);
  }

  saveCurrentProjectData() {
    this.props.actions.saveCurrentProjectData(this.props.graph);
  }

  render() {
    if (this.props.searchData === null) {
      return (
        <div>Loading...</div>
      );
    } else {
      return (
        <div className="searchResults">
          { !this.props.searchData ? 
            null :
            this.props.searchData.map((entity) => {
              return (
                // <EntityCard data={entity} addToGraph={this.addToGraph} />
                <SearchCard id={entity._id} data={entity} graph={this.props.graph}/>
              );
            })
          }
        </div>
      );
    }
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  if (state.data.canvas) {
    return {
      searchData: state.data.canvas.searchData
    }
  }
  return {
    searchData: null
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch));