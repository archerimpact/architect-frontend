import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import DatabaseSearchBar from '../../components/SearchBar/databaseSearchBar'
import {Link, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router'

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import * as server from '../../server/';
import './style.css';

const urlPropsQueryConfig = {
  search: { type: UrlQueryParamTypes.string },
};

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton style={{color: 'inherit'}} label="Login"  onClick={() => this.props.logIn()}/>
    );
  }
}

class Home extends Component {

  render() {
    return (
        <div className='home-container' style={{height:'100%'}}>
          <h1>ARCHITECT</h1>
          <p>A World of Data at your Fingertips</p>
          <div className="search-main">
              <DatabaseSearchBar/>
          </div>
        </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  return {
    savedEntities: state.data.savedEntities,
    savedSources: state.data.savedSources
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
