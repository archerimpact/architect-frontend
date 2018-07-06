import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { resetGraphDispatch, toggleSidebar } from '../../redux/actions/graphActions';

import './style.css'

const SideNavBar = ({ dispatch }) => {
  return (
    <div className="side-nav">
      <ReactTooltip place="right" effect="solid"/>
      <Link to='/'>
        <div className="side-nav-button" data-tip="Home">
          <i className="material-icons">home</i>
        </div>
      </Link>
      <Link to='/explore/search'>
        <div className="side-nav-button" data-tip="Graph">
          <i className="material-icons">data_usage</i>
        </div>
      </Link>
      {/*<Link to='/' onClick={() => { dispatch(resetProjectDispatch()); }}>*/}
        {/*<div className="side-nav-button" data-tip="Spaces">*/}
          {/*<i className="material-icons">dashboard</i>*/}
        {/*</div>*/}
      {/*</Link>*/}
      {/*<Link to='/user'>*/}
        {/*<div className="side-nav-button" data-tip="Account">*/}
          {/*<i className="material-icons">account_box</i>*/}
        {/*</div>*/}
      {/*</Link>*/}
      <div className="bottom">
        {/*<Link to='/settings'>*/}
          {/*<div className="side-nav-button" data-tip="Settings">*/}
            {/*<i className="material-icons">settings</i>*/}
          {/*</div>*/}
        {/*</Link>*/}
        <Link to='/help'>
          <div className="side-nav-button" data-tip="Help">
            <i className="material-icons">help</i>
          </div>
        </Link>
      </div>
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch,
  };
}

function mapStateToProps(state) {
  return {
    sidebarVisible: state.graph.sidebarVisible
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideNavBar));
