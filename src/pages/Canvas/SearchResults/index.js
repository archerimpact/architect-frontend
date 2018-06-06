import React, {Component} from 'react';

import './style.css'
import SearchCard from '../SearchCard';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {addToGraphFromId, saveCurrentProjectData} from '../../../redux/actions/graphActions';

class BackendSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showResults: true,
    };
  }

  toggleSearchResults = () => {
    return this.setState({showResults: !this.state.showResults});
  }

  addToGraph = (id) => {
    this.props.dispatch(addToGraphFromId(this.props.graph, id));
  }

  saveCurrentProjectDataFunc = () => {
    this.props.dispatch(saveCurrentProjectData(this.props.graph));
  }

  render() {
    if (this.props.searchData === null) {
      return (
        <div>Loading...</div>
      );
    } else {
      return (
        <div className="search-results">
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
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  if (state.graph.canvas) {
    return {
      searchData: state.graph.canvas.searchData
    }
  }
  return {
    searchData: null
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch));