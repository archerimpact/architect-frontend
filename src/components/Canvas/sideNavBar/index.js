import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { resetProjectDispatch } from '../../../redux/actions/graphActions';

import './style.css'

class SideNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
    }

    render() {
        const { dispatch } = this.props;

        return (
            <div className="side-nav">
                <ReactTooltip place="right" effect="solid"/>
                <Link to='/' onClick={() => {
                    dispatch(resetProjectDispatch());
                }}>
                    <div className="side-nav-button" data-tip="Home">
                        <i className="material-icons">home</i>
                    </div>
                </Link>
                <Link to='/data'>
                    <div className="side-nav-button" data-tip="Data">
                        <i className="material-icons">data_usage</i>
                    </div>
                </Link>
                <Link to='/build' onClick={() => {
                    dispatch(resetProjectDispatch());
                }}>
                    <div className="side-nav-button" data-tip="Spaces">
                        <i className="material-icons">dashboard</i>
                    </div>
                </Link>
                <Link to='/user'>
                    <div className="side-nav-button" data-tip="Account">
                        <i className="material-icons">account_box</i>
                    </div>
                </Link>
                <Link to='/upload'>
                    <div className="side-nav-button" data-tip="Data Upload">
                        <i className="material-icons">cloud_upload</i>
                    </div>
                </Link>
                <div className="bottom">
                    <Link to='/settings'>
                        <div className="side-nav-button" data-tip="Settings">
                            <i className="material-icons">settings</i>
                        </div>
                    </Link>
                    <Link to='/help'>
                        <div className="side-nav-button" data-tip="Help">
                            <i className="material-icons">help</i>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

export default withRouter(connect(mapDispatchToProps)(SideNavBar));
