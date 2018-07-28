import React, {Component} from "react";
import {Route} from "react-router-dom";
import Home from "../components/Home/";
import Canvas from "../components/Canvas";
import SideNavbar from '../components/sideNavBar';
import Ingestor from "../components/Ingestor";

import "./style.css";

export default class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            IE: false,
            phone: false
        }
    }

    componentWillMount() {
        if (navigator.appName === 'Microsoft Internet Explorer' || 'ActiveXObject' in window) {
            this.setState({IE: true})
        }

        if (window.innerWidth < 678) {
            this.setState({phone: true})
        }
    }

    render() {
        const { IE, phone } = this.state;
        if (IE) {
            return <h1 className="special-message" style={{width: window.innerWidth}}>Unfortunately, Internet Explorer is not yet a supported browser, though we are working on supporting it.  Please access the site using a browser such as Chrome or Firefox.</h1>
        } else if (phone) {
            return <h1 className="special-message" style={{width: window.innerWidth}}>Please use a computer for a full interactive experience.</h1>
        }
        else {
            return (
                <div>
                    <div className="main">

                        {/* OLD ROUTING */}
                        {/*<PrivateRoute exact path="/" component={Home}/>*/}
                        {/*<Route path="/login" component={Login}/>*/}
                        {/*<Route path="/create_account" component={CreateAccount}/>*/}
                        {/*<PrivateRoute path="/explore/:sidebarState?" component={Canvas}/>*/}
                        {/*<PrivateRoute path="/build/:investigationId/:sidebarState?/:query?" component={Canvas}/>*/}
                        {/*<PrivateRoute exact path="/build" component={Investigations}/>*/}

                        <Route exact path="/:id?" component={Home}/>
                        <Route path="/explore/:sidebarState?/:query?" component={Canvas}/>
                        <Route path="/ingest/:documentId" component={Ingestor} />
                    </div>
                </div>
            );
        }
    }
}