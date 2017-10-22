import React, { Component } from 'react';

//import '../App.css'
import './ProjectPage.css'

import EntitiesTable from './EntitiesTable';
import EntityExtractor from './EntityExtractor';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import Paper from 'material-ui/Paper';
import NodeGraph from '../DocumentPage/NodeGraph';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/';

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

    render() {
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
                    <Paper style={{width:"80%", margin:"0px auto", display:"flex"}}>
                        <NodeGraph entities={this.props.savedEntities.entities} documents={[]}/>
                        <div className="text-container">
                            <EntityExtractor/>
                        </div>
                    </Paper>
                    <Paper className="table">                         
                        <EntitiesTable entities={this.props.savedEntities.entities}/>
                    </Paper>
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
