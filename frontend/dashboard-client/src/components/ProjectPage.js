import React, { Component } from 'react';
import axios from 'axios'

import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import EntitiesTable from './EntitiesTable';
import EntityExtractor from './EntityExtractor';
import Paper from 'material-ui/Paper';
import './App.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';
import * as server from '../server/'

class ProjectPage extends Component {
    constructor(props){
        super(props)
        var project = this.props.projects[this.props.match.params.id]
        this.state = {
            project: project,
            title: project.title,
            entities: []
        }
    }

    componentWillMount = () => {
        server.getProject()
            .then((data) => {
                this.setState({
                    entities: data
                })
                this.props.dispatch(actions.addEntities(data))
            })
    }

    render() {
        let entities = null
        let title = null
        if (this.state) {
            entities = <EntitiesTable entities={this.state.entities}/>
            title = <h2>{this.state.title}</h2>}
        return (
            <div>
                <div className="App">
                    <div className="header">
                        <div className="header-text">
                            <h2>{this.state.title}</h2>
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
                            <EntitiesTable entities={this.state.entities}/>
                        </Paper>
                        <div className="text-container">
                            <Paper className="text-container">
                                <EntityExtractor/>
                            </Paper>
                        </div>
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
        entityNames: state.data.entityNames,
        projects: state.data.projects
    };
}

 
export default connect(mapStateToProps, mapDispatchToProps)(ProjectPage)
