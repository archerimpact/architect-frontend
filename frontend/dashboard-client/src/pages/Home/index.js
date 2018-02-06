import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import { Link } from 'react-router-dom';
import * as server_utils from '../../server/utils';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';
import Folder from 'material-ui/svg-icons/file/folder';

import ProjectList from '../../containers/ProjectList/';
import './style.css'

class Home extends Component {

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="app">
                    <div style={{width:'100%', margin:'0 auto', top: 64}}>
                        <ProjectList/>                        
                    </div>
                </div>
                <Link to={"/homepage/"}>
                    <ListItem 
                        primaryText='click me for homepage'
                    />
                </Link>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        savedSources: state.data.savedSources
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
