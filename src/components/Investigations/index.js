import React, {Component} from "react";
import {connect} from "react-redux";
import {getProjects} from "../../redux/actions/projectActions";
import * as server from '../../server/';

import {Link, withRouter} from "react-router-dom";

import Spaces from './Spaces';
import Data from './Data';
import UploadData from './UploadData';
import SpacesPreview from './SpacesPreview';

import InlineSVG from 'svg-inline-react';

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
      };
    }

    componentDidMount() {
      this.props.dispatch(getProjects());
    }

    handleSpaceClick = (project) => {
      this.setState({ selectedProject: project})
    }

    handleSpaceDoubleClick = (project) => {
      this.props.history.push('/build/' + project._id);
    }

    handleDelete = (project) => {
      server.deleteProject(project._id)
        .then((data)=> {
          this.fetchProjects();
        });
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