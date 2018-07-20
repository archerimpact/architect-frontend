import React, {Component} from "react";
import {Redirect, Route, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {userLogOut} from "../redux/actions/userActions";
import PrivateRoute from "./PrivateRoute"
import Login from "../components/Login";
import Canvas from "../components/Canvas";

import "./style.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IE: false,
            phone: false
        }
    }

    componentWillMount() {
        if (navigator.appName === 'Microsoft Internet Explorer' || 'ActiveXObject' in window) {
            this.setState({IE: true})
        }


        if (window.innerWidth < 0) {
            this.setState({phone: true})
        }
    }

    logOut() {
        return this.props.dispatch(userLogOut());
    }

    render() {
        const {IE, phone} = this.state;
        if (IE) {
            return <h1 className="special-message">Unfortunately, Internet Explorer
                is not yet a supported browser, though we are working on supporting it. Please access the site using a
                browser such as Chrome or Firefox.</h1>
        } else if (phone) {
            return <h1 className="special-message">Please use a computer for a full
                interactive experience.</h1>
        } else {
            return (
                <div>
                    <div>
                        <Route exact path="/" component={Login}/>
                        <PrivateRoute path="/explore/:sidebarState/:query?" component={Canvas}/>
                    </div>
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

export default withRouter(connect(mapDispatchToProps)(App));