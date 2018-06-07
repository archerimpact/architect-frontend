import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

class UploadData extends Component {

  render() {
    return (
      <div >
        <div className="d-flex investigations-page-header">
          <h3>Upload Your Data</h3>
        </div>
        <div className="d-flex btns-row">
          <button className="focal-btn">Upload</button> 
        </div>
        <div className="investigations-grid">
        {this.props.projects.map((proj) => {
          let image_blob;   
          if (proj.img) {
            image_blob = "data:image/svg+xml;charset=utf-8,"+ proj.img;
          }
          else {
            image_blob = "no image provided";
          }
          return (
            <div key={proj._id}>
              <Link to={`/build/${proj._id}`}>
                <div className="card investigation-card investigation-card-accented">
                  <img className="card-img-top" src={image_blob} alt={""}></img>
                  <div className="card-body investigation-card-body">
                    {proj.published ? <div className="card-text investigation-card-text status-public">PUBLIC</div> :
                      <div className="status-private">PRIVATE</div>
                    }
                     <div className="card-title investigation-card-title">{proj.name}</div>
                    <i className="card-text investigation-card-text">{proj.last_modified}</i>
                    <p className="card-text investigation-card-text">{proj.description}</p>
                  </div>  
                </div>
              </Link>
            </div>
          )
        })}
        </div>
      </div>            
    ); 
  }    
}

export default UploadData;