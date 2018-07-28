import React, {Component} from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import SideNavBar from "../sideNavBar";
// import DocumentDisplay from './documentDisplay';


class Build extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ingest-container">
              <SideNavBar />
            </div>
        );
    }

}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

export default withRouter(connect(mapDispatchToProps)(Build));