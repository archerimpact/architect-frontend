import React, { Component } from "react";
import { connect } from "react-redux";
import { getProjects, deleteProject } from "../../redux/actions/projectActions";

import { withRouter } from "react-router-dom";

import Spaces from './Spaces';
import SpacesPreview from './SpacesPreview';

import "./style.css";

class Investigations extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [
                { name: "OFAC SDN", favorited: true, lastUpdated: "5 min ago", dataset: "OFAC SDN List", published: true },
                { name: "UN Sanctions", favorited: true, lastUpdated: "25 May 2018", dataset: "Open Sanctions", published: true },
                { name: "Czech Registry", favorited: false, lastUpdated: "2 hrs ago", published: false},
                { name: "UK Business Registry", favorited: false, lastUpdated: "5 min ago" },
                { name: "European Parliament Vote Data", favorited: false, lastUpdated: "25 May 2018" },
                { name: "FARA USA", favorited: false, lastUpdated: "2 hrs ago"}
            ],
            selectedProject: null
        }; // this is initial data to populate the spaces preview sidebar; we will probably scrap it later
        // as we redesign the page so it's not worth spending time on putting it in redux right now.
    }

    componentDidMount() {
        this.props.dispatch(getProjects());
    }

    componentWillReceiveProps(nextprops) {
        this.setState({ selectedProject: nextprops.project_list[0]});
    }

    handleSpaceClick = (project) => {
        this.setState({ selectedProject: project })
    }

    handleSpaceDoubleClick = (project) => {
        this.props.history.push('/build/' + project._id);
    }

    handleDelete = (project) => {
        this.props.dispatch(deleteProject(project._id));
    }

    render() {
        return (
            <div className="page y-scrollable">
                <div className="page-body col-md-8">
                    <div className="spaces">
                        <Spaces projects={this.props.project_list}
                                onSpaceClick={this.handleSpaceClick}
                                onSpaceDoubleClick={this.handleSpaceDoubleClick}
                                selectedProject={this.state.selectedProject}
                        />
                    </div>
                </div>
                <div className="upload-data col-md-4">
                    <SpacesPreview project={this.state.selectedProject} data={this.state.data} onDelete={this.handleDelete}/>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.user.isAuthenticated,
        project_list: state.project.project_list
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Investigations));