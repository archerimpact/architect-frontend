import React, {Component} from "react";
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import {withRouter} from "react-router-dom";
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import GraphPreview from '../GraphPreview';
import {connect} from "react-redux";

import './style.css'

class VignettePreview4 extends Component {

  constructor(props) {
    super(props);
      this.graph = new ArcherGraph();
      this.state = {
      isModalOpen: true,
      colorProfile: props.colorProfile,
    }
  }

  handleClose = () => {
      this.setState({ isModalOpen: false });
  };

  render() {
    const { name, author, description, handleClose } = this.props;
    return (
      <div>
          <ModalContainer onClose={handleClose}>
              <ModalDialog onClose={handleClose}>
                  <div className="vignette-card">V
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignettePreview4));