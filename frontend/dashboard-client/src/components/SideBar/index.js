import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import { withRouter, Link } from 'react-router-dom';
import * as server_utils from '../../server/utils';

import styles from './styleNew';
import AddProject from './AddProject/';

import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import 'font-awesome/css/font-awesome.min.css';
import './style.css';


decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder-o' : 'file-text-o';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginLeft: '5px', marginRight: '5px'};
    const pathname = '/'+node.name + '/'+node.pid
    return (
         <div style={style.base}>
             <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {node.children ? node.name : 
                    <Link style={{color: 'inherit', textDecoration: 'none',}} to={pathname}> 
                        {node.name}
                    </Link>
                }
            </div>
        </div>
    );
};

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.onToggle = this.onToggle.bind(this);
        this.projectList = this.projectList.bind(this);
        this.addProject = this.addProject.bind(this);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this.props.actions.fetchProjects();        
    }
    componentWillMount() {
        if (this.props.isAuthenticated){
            this.setState({
                data: this.projectList(this.props.projects)
            });
        }
    }

    componentWillReceiveProps(nextProps){
        var newProjects = this.projectList(nextProps.projects);
        this.setState({
            data: newProjects
        });
    }

    addProject(freshProject) {
        server_utils.addProject(freshProject)
        .then((data) => {
            this.props.actions.fetchProjects();
        })
        .catch(error => {console.log(error)})
      }

    projectList(projects) {
        const projectItems = projects.map((project) => {
            return ({
                name: project.name,
                children: [
                    { name: 'canvas', pid: project._id},
                    { name: 'sources', pid: project._id},
                    { name: 'entities', pid: project._id}
                ]
            })
        });
        return projectItems;
    }

    onToggle(node, toggled) {
        const {cursor} = this.state;
        if (cursor) {
            cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({cursor: node});
    }

    render() {
        // Can reference current node with this.props.node
        if (!this.props.isAuthenticated) {
            return null
        } else {
            const {data: stateData, cursor} = this.state
            return (
                <div className="directory">
                    <AddProject submit={(freshProject)=>this.addProject(freshProject)} />
                    <StyleRoot>
                        <div style={styles.component}>
                            <Treebeard data={stateData}
                                       decorators={decorators}
                                       onToggle={this.onToggle}
                                       style={styles}/>
                        </div>
                    </StyleRoot>
                </div>
            );
        }
        
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    if (state.data.savedProjects.status === 'isLoading') {
        return {
            status: state.data.savedProjects.status,
            }
    } else {
        return {
            status: state.data.savedProjects.status,
            projects: state.data.savedProjects.projects,
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);