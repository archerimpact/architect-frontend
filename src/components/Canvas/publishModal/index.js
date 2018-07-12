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

  fetchLink = async (title, author, description, graph) => {
    let response = await saveLink(title, author, description, graph)
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
            <input value={"https://viz.archerimpact.com/" + this.state.link} className="form-control" readOnly/>
            <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`${ this.state.title ? `"${this.state.title}" - ` : '' }Check out my powerful interactive graph visualization of a sanctioned network on #ArcherViz @archerimpact https://viz.archerimpact.com/t/${this.state.link}`)} >
              <i id="tweet-link" className="twitter-action fab fa-twitter"></i>
            </a>
          </div>
          <p className="link-warning"><small>To edit the text above, simply make your edits and generate a new link.</small></p>
          <p className="link-warning mb-0"><small>Warning: This link will not be shown again, so make sure to copy it somewhere safe if you'd like to keep it around!</small></p>
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
              <h4 className="modal-title">Share this network</h4>
              <p className="lead">
                Want to show off an interesting network you found? With ArcherViz, you can now share fully-interactive graphs via a link! Generate a link below that you can share on social media or send individually.
              </p>

              <form>
                <div className="form-row">
                  <div className="form-group col">
                    <label htmlFor="title-input">Title</label>
                    <input className="form-control" id="title-input" placeholder="Title" value={title} onChange={(e) => this.handleTitleChange(e.target.value)} />
                  </div>
                  <div className="form-group col">
                    <label htmlFor="author-input">Author</label>
                    <input className="form-control" id="author-input" placeholder="Your name" value={author} onChange={(e) => this.handleAuthorChange(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="description-textarea">Description</label>
                    <textarea className="form-control" id="description-textarea" value={description} onChange={(e) => this.handleDescriptionChange(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div id="publish-submit" className="btn btn-primary" onClick={() => this.fetchLink(title, author, description, graph)}>
                    Submit
                  </div>
                </div>
              </form>
              { this.renderLink() }
            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    );
  }
}