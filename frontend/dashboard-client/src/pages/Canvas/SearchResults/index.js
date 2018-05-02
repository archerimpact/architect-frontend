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
    this.state = {
      showResults: true,
      history: []
    };
  }

  componentDidMount() {
    /* handles the case when the URL containts the search params and you're
      linking there directly. Only search if there's params */
    if (this.props.search !== null) {
      this.props.actions.fetchSearchResults(this.props.graph, this.props.search);
    }
    this.props.history.listen((location, action) => {
      this.setState({history: [...this.state.history, location]});
    })
  }

  componentWillReceiveProps(nextprops) {
    /* handles the case when you are already on backend search and are
      searching again in the nav bar; react only recognizes that there's nextprops */
    if (this.props.search !== null && this.props.search !== nextprops.search) {
      if (this.props.entity !== null && this.props.entity !== undefined) {
        this.props.actions.fetchGraphFromId(this.props.entity);
      }
      this.props.actions.fetchSearchResults(this.props.search);
      this.setState({ showResults: true })
    }
  }

  toggleSearchResults() {
    return this.setState({ showResults: !this.state.showResults })
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
                <EntityCard entity={entity} key={entity._source.neo4j_id} fetch={this.props.actions.fetchGraphFromId} newgraphid={true} />
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

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch)));