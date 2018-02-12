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
import styles from './styleNew';
import AddProject from '../../components/Project/addProject';

import ReactDOM from 'react-dom';
import {Treebeard, decorators} from 'react-treebeard';
import {StyleRoot} from 'radium';
import PropTypes from 'prop-types';
import * as filters from './filter';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};
    style.base.color = '#b8d3ed';

    return (
         <div style={style.base}>
             <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>

                {node.name}
            </div>
        </div>
    );
};

class NodeViewer extends React.Component {
    render() {
        const style = styles.viewer;
        let json = JSON.stringify(this.props.node, null, 4);

        if (!json) {
            json = HELP_MSG;
        }

        return <div style={style.base}>{json}</div>;
    }
}
NodeViewer.propTypes = {
    node: PropTypes.object
};

class NewHome extends React.Component {
    constructor(props) {
        super(props);

        const data = {
            name: 'projects',
            toggled: true,
            children: this.projectList(this.props.projects)
        }

        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
        this.projectList = this.projectList.bind(this);
        this.addProject = this.addProject.bind(this);
    }

    addProject(freshProject) {
        server_utils.addProject(freshProject);
        this.props.actions.fetchProjects();
      }

    projectList(projects) {
        const projectItems = projects.map((project) => {
            return ({
                name: project.name,
                children: [
                    { name: 'canvas'},
                    { name: 'sources'},
                    { name: 'entities'}
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

    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState(this.state.data);
        }
        var filtered = filters.filterTree(this.state.data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }

    render() {
        const {data: stateData, cursor} = this.state;

        return (
            <div>
            <AddProject submit={(freshProject)=>this.addProject(freshProject)} />
            <StyleRoot>
                <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </div>
                </div>
                <div style={styles.component}>
                    <Treebeard data={stateData}
                               decorators={decorators}
                               onToggle={this.onToggle}/>
                </div>
                <div style={styles.component}>
                    <NodeViewer node={cursor}/>
                </div>
            </StyleRoot>
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

export default connect(mapStateToProps, mapDispatchToProps)(NewHome);
