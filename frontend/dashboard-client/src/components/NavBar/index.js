import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import AppBar from 'material-ui/AppBar';

import SearchBar from '../../pages/BackendSearch/components/SearchBar'
import {Link, withRouter} from 'react-router-dom';
import { Redirect } from 'react-router'

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import * as server from '../../server/';

const urlPropsQueryConfig = {
  search: { type: UrlQueryParamTypes.string },
  foo: { type: UrlQueryParamTypes.number, queryParam: 'fooInUrl' },
};

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton style={{color: 'inherit'}} label="Login"  onClick={() => this.props.logIn()}/>
    );
  }
}

class NavBar extends Component {

  static propTypes = {
    // URL props are automatically decoded and passed in based on the config
    search: PropTypes.string,
    foo: PropTypes.number,

    // change handlers are automatically generated when given a config.
    // By default they update that single query parameter and maintain existing
    // values in the other parameters.
    onChangeFoo: PropTypes.func,
    onChangeSearch: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.searchBackendText = this.searchBackendText.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.state={
      searchData: null,
      fireRedirect: false,
      query: null
    }
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState({searchData: data.hits.hits, nodesData: null})
      })
      .catch((error) => {console.log(error)});
  }

  goToSearchPage(query){
    this.setState({fireRedirect: true});
    this.setState({query: query})
    this.props.onChangeSearch(query)
  }

	render () {
		var self = this
		const Logged = withRouter(({ history }) => (
		  <IconMenu style={{color: 'inherit'}}
		    iconButtonElement={
		      <IconButton><MoreVertIcon /></IconButton>
		    }
		    targetOrigin={{horizontal: 'right', vertical: 'top'}}
		    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
		  >
		    <MenuItem primaryText="Refresh" />
		    <MenuItem primaryText="Help" />
		    <MenuItem primaryText="Sign out" 
		    	onClick={() => {				
		    	self.props.logOut()
				}}
		    />
		  </IconMenu>
		  )
		);
		const Login = withRouter(({ history }) => (
		  <FlatButton> 
		  	<Link style={{textDecoration: 'none', color: 'inherit'}} to={{
			    pathname: '/login',
			    state: { from: this.props.location }
			  }}> Login </Link>
		   </FlatButton>
		  )
		);

    const { fireRedirect } = this.state

    if (fireRedirect) {
      this.setState({fireRedirect:false})
      return (
        <Redirect to={'/backendsearch?search=' + this.props.search}  />
      );
    }

    return (
			<div className="outerContainer">
          <Link to="/">
            <div className="logo" />
          </Link>
          <div className="searchContainer">
            <SearchBar onChange={this.searchBackendText} onSubmit={this.goToSearchPage}/>
          </div>
          <div className="iconMenu">
            {this.props.isAuthenticated ? <Logged logOut={this.props.logOut.bind(this)}/> : <Login logIn={this.props.logIn.bind(this)}/>}
          </div>
			</div>
		);
	};
};

export default addUrlProps({ urlPropsQueryConfig })(NavBar);
