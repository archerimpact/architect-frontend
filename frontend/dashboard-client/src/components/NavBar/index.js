import React, { Component } from 'react';

import './style.css'

import AppBar from 'material-ui/AppBar';

import SearchBar from '../../pages/BackendSearch/components/SearchBar'
import {Link, withRouter} from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton style={{color: 'inherit'}} label="Login"  onClick={() => this.props.logIn()}/>
    );
  }
}

class NavBar extends Component {

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
		return (
			<div className="outerContainer">
          <div className="logo" />
          <div className="searchContainer">
            <SearchBar />
          </div>
          <div className="iconMenu">
            {this.props.isAuthenticated ? <Logged logOut={this.props.logOut.bind(this)}/> : <Login logIn={this.props.logIn.bind(this)}/>}
          </div>
			</div>
		);
	};
};

export default NavBar;
