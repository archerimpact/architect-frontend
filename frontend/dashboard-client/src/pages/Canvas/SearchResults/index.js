import React, { Component } from 'react';

import './style.css'
import EntityCard from './EntityCard';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../Graph/graphActions';

class BackendSearch extends Component {

  constructor(props) {
    super(props);
    this.toggleSearchResults = this.toggleSearchResults.bind(this);
    this.addToGraph = this.addToGraph.bind(this);
    this.state = {
      showResults: true,
    };
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.search !== null && this.props.search !== nextprops.search) {
      this.setState({ showResults: true });
    }
  }

  toggleSearchResults() {
    return this.setState({ showResults: !this.state.showResults });
  }

  addToGraph(id) {
    let path =  this.props.location.pathname;
    let searchQuery = this.props.search ? 'search=' + this.props.search : '';
    let graphQuery = id ? '&graphid=' + id : '';
    this.props.history.push(path + '?' + searchQuery + graphQuery);
    // this.props.actions.fetchGraphFromId(this.props.graph, id);
    // this.props.actions.addToGraphFromId(this.props.graph, id);
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
                <EntityCard entity={entity} key={entity._source.neo4j_id} addToGraph={this.addToGraph} newgraphid={true} />
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