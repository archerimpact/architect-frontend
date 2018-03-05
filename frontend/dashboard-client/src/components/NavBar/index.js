import React, { Component, PropTypes } from 'react';
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query';

import './style.css'

import AppBar from 'material-ui/AppBar';

import SearchBar from '../SearchBar'
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

  constructor(props) {
    super(props);
    this.searchBackendText = this.searchBackendText.bind(this);
    this.goToSearchPage = this.goToSearchPage.bind(this);
    this.state={
      searchData: null,
      fireRedirect: false,
    }
  }

  searchBackendText(query){
    server.searchBackendText(query)
      .then((data)=>{
        this.setState({searchData: data.hits.hits})
      })
      .catch((error) => {console.log(error)});
  }

  goToSearchPage(query){
    this.setState({fireRedirect: true});
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

    if (this.state.fireRedirect) {
      this.setState({fireRedirect:false})
      return (
        <Redirect to={'/search?search=' + this.props.search}  />
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
