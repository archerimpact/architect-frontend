import React, {Component} from "react";
import {connect} from "react-redux";
import {userLogOut} from "../redux/actions/userActions";

import {Redirect, Route, withRouter} from "react-router-dom";
import PrivateRoute from "./PrivateRoute/";

import NavBar from "../components/navBar/";
import ModalDataUpload from "../components/modalDataUpload"
import Login from "../components/Login/";
import CreateAccount from "../components/CreateAccount/";
import Home from "../components/Home/";
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
        var buildCanvasPath = new RegExp('/build/\\S+');
        let currentPath = props.location.pathname;
        if (buildCanvasPath.test(currentPath)) {
            return false;
        }
        return true;
    }
// TODO undo that change (CHANGE DIS)
    render() {
        return (
            <div>
                {!this.state.navbarVisible ?
                    null :
                    <NavBar isAuthenticated={this.props.isAuthenticated} logOut={this.logOut.bind(this)}
                            logIn={this.logIn.bind(this)}/>
                }
                <div className={"main " + (this.state.navbarVisible ? "show-nav" : "no-nav")}>
                    <PrivateRoute exact path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/create_account" component={CreateAccount}/>
                    <PrivateRoute path="/explore/:sidebarState?" component={Canvas}/>
                    <PrivateRoute path="/build/:investigationId/:sidebarState?/:query?" component={Canvas}/>
                    <PrivateRoute exact path="/build" component={Investigations}/>
                    <PrivateRoute path="/upload" component={ModalDataUpload}/>
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
