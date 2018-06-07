import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import Data from '../Data';

import './style.css';

class SpacesPreview extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.project) {
      let nodesLength = this.props.project.data && this.props.project.data.nodes ? this.props.project.data.nodes.length : 0;
      let linksLength = this.props.project.data && this.props.project.data.links ? this.props.project.data.links.length: 0
      return (
        <div >
          {this.props.project.published ? <div className="card-text investigation-card-text status-public">PUBLIC</div> :
            <div className="status-private">PRIVATE</div>
          }
          <div className="d-flex investigations-page-header">
            <h3>{this.props.project.name}</h3>
          </div>
          <div className="card project-details-card">
            <div className="project-details-cell">
              <div className="project-details-text">
                <span className="material-icons subtle-icon">insert_chart_outlined</span>
                <span className="text-emphasized">7 </span>
                datasets
              </div>
            </div>
            <div className="project-details-cell">
              <div className="project-details-text">
                <span className="material-icons subtle-icon">person_outlined</span>
                <span className="text-emphasized">{nodesLength} </span>
                entities
              </div>
            </div>
            <div className="project-details-cell">
              <div className="project-details-text">
                <span className="material-icons subtle-icon">share</span>
                <span className="text-emphasized">{linksLength} </span>
                links
              </div>
            </div>
          </div>
          <div className="card data-section">
            <div className="card-header">
              Datasets
            </div>
            <Data data={this.props.data}/>
          </div>
          <div className="card data-section">
            <Link to={`/build/${this.props.project._id}`}>
              <div className="card-header image-header toaster-button">Go to Space</div>
            </Link>
            <div className="card-body">
              <img className="image-full" src={"data:image/svg+xml;charset=utf-8," + this.props.project.img}></img>
            </div>
          </div>
          <div className="card card-header data-section delete-button" onClick={() => {this.props.onDelete(this.props.project)}}>Delete Space</div>
        </div>            
      ); 
    } else {
      return (
        <div></div>
      )
    }
  }    
}

export default SpacesPreview;