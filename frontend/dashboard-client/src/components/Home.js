import React, { Component } from 'react';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Paper from 'material-ui/Paper';
import ProjectsTable from './ProjectsTable';


import './App.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

import {
  Link
} from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <div className="App">
                    <div className="header">
                        <div className="header-text">
                            <h2>Your Projects</h2>
                        </div>
                        <div id="notifications">
                            <Badge
                              badgeContent={10}
                              secondary={true}
                              badgeStyle={{top: 12, right: 12}}
                            >
                              <IconButton tooltip="Notifications">
                                <NotificationsIcon />
                              </IconButton>
                            </Badge>
                        </div>
                    </div>
                    <div className="body">
                        <Paper className="table">
                            <ProjectsTable/>
                        </Paper>
                    </div>
                    

                </div>
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
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(Home)
