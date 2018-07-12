import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { saveLink } from '../../../redux/actions/graphActions';
import Script from 'react-load-script';

import './style.css'

export default class PublishModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      link: "",
      title: "",
      author: "",
      description: "",
    }
  }

  fetchLink = async (graph) => {
    let response = await saveLink(graph)
    this.setState({link: response})
  }

  handleTitleChange = (val) => {
    this.setState({title: val})
  }

  handleAuthorChange = (val) => {
    this.setState({author: val})
  }

  handleDescriptionChange = (val) => {
    this.setState({description: val})
  }

  renderLink = () => {
    if (this.state.link === '') {
      return (<div></div>);
    }
    else {
      return (
        <div className="generated-link">
          <p>Feel free to tweet this out, or directly share this link:</p>
          <div className="flex-row share-row">
            <input value={"https://viz.archerimpact.com/t/" + this.state.link} className="form-control" readOnly/>
            <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`${ this.state.title ? `"${this.state.title}" - ` : '' }Check out my powerful interactive graph visualization of a sanctioned network on #ArcherViz @archerimpact https://viz.archerimpact.com/t/${this.state.link}`)} >
              <i id="tweet-link" className="twitter-action fab fa-twitter"></i>
            </a>
          </div>
        </div>
      );
    }
  }

  render() {
    const { graph } = this.props;
    const { title, author, description } = this.state;
    return (
      <div onClick={this.props.handleClick}>
        <ModalContainer onClose={this.props.handleClose}>
          <ModalDialog onClose={this.props.handleClose}>
            <Script url="https://platform.twitter.com/widgets.js" />
            <div id="publish-modal">
              <h4 className="modal-title">Share this investigation</h4>
              <p className="lead">
                Found an interesting network?  Want to show off?  Generate a link to your investigation that you can share on social media or send to coworkers.
              </p>

              <div id="publish-submit" className="btn btn-primary" onClick={() => this.fetchLink(graph)}>
                Submit
              </div>
              { this.renderLink() }
            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    );
  }
}