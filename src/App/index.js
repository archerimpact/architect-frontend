import React, {Component} from "react";
import {connect} from "react-redux";
import {userLogOut} from "../redux/actions/userActions";

import {Redirect, Route, withRouter} from "react-router-dom";
import PrivateRoute from "./PrivateRoute/";

import NavBar from "../components/navBar/";
import SideNavBar from '../components/Canvas/sideNavBar/'

import Login from "../components/Login/";
import CreateAccount from "../components/CreateAccount/";
import HomeVignettes from "../components/HomeVignettes/";
import Canvas from "../components/Canvas";
import Investigations from "../components/Investigations";
import "./style.css";

class App extends Component {

    constructor(props) {
        super(props);
        this.isNavbarVisible = this.isNavbarVisible.bind(this);
        this.state = {
            navbarVisible: this.isNavbarVisible(props),
        };
    }

    componentDidMount() {
        this.setState({navbarVisible: this.isNavbarVisible(this.props)})

    }

    componentWillReceiveProps(nextProps) {
        this.setState({navbarVisible: this.isNavbarVisible(nextProps)})
    }

    logOut() {
        return this.props.dispatch(userLogOut());
    }

    logIn() {
        return (<Redirect to={'/login'}/>);
    }

    isNavbarVisible(props) {
        // var exploreCanvasPath = RegExp('/explore/*');
      const buildCanvasPath = new RegExp('/build/\\S+');
      const homePath = new RegExp('/'); 
      let currentPath = props.location.pathname;
      return !(buildCanvasPath.test(currentPath) || homePath.test(currentPath));
    }

    render() {
        return (
            <div>
                {!this.state.navbarVisible ?
                    null : null
                    /*<NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)}
                            logIn={this.logIn.bind(this)}/>*/
                }
              {<SideNavBar />}
                <div className={"main " + (this.state.navbarVisible ? "no-nav" : "no-nav")}>
                    <PrivateRoute exact path="/" component={HomeVignettes}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/create_account" component={CreateAccount}/>
                    <PrivateRoute path="/explore/:sidebarState?" component={Canvas}/>
                    <PrivateRoute path="/build/:investigationId/:sidebarState?/:query?" component={Canvas}/>
                    <PrivateRoute exact path="/build" component={Investigations}/>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
