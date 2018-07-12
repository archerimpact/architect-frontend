import React, {Component} from "react";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/';
import * as homeActions from '../../../redux/actions/homeActions';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import GraphPreview from '../GraphPreview';

import { Link } from "react-router-dom";

import './style.css'

class VignetteModal4 extends Component {


    constructor(props) {
      super(props);
      this.graph = new ArcherGraph();
    }

    render() {
        const { name, author, description } = this.props;
        return (
          <div onClick={this.props.handleClick}>
            <ModalContainer onClose={this.props.handleClose}>
              <ModalDialog onClose={this.props.handleClose}>
                <div className="vignette-card">
              <div className="vignette-card-row flex-row">
                <div className="vignette-card-col vignette-card-left-col">
                  <div className="vignette-card-header">
                    <h4 className="vignette-title">{name}</h4>
                    <p className="vignette-author">{author}</p>
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                        {description}
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                    <GraphPreview index={this.props.index} graph={this.graph} />
                </div>
              </div>
            </div>
              </ModalDialog>
            </ModalContainer>
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
        name: state.home.vignetteGraphData[4].name,
        author: state.home.vignetteGraphData[4].author,
        description: state.home.vignetteGraphData[4].description,
        id: state.home.vignetteGraphData[4].id,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignetteModal4));
