import React, { Component } from 'react';

import { Link, withRouter } from 'react-router-dom';

import CreateSpace from './components/CreateSpace';
import './style.css';

class Spaces extends Component {

  constructor(props) {
    super(props);
    this.toggleCreateSpace = this.toggleCreateSpace.bind(this);

    this.state = {
      createSpaceOpen: false
    }
  }

  toggleCreateSpace() {
    this.setState({ createSpaceOpen: !this.state.createSpaceOpen});
  }

  render() {
    return (
      <div >
        <div className="d-flex investigations-page-header">
          <h3>Spaces</h3>
        </div>
        <div className="d-flex btns-row">
          <button className="upload-btn">Find Space</button> 
          <div>
            <button className="focal-btn" onClick={() => {this.toggleCreateSpace()}}>Create Space</button> 
            {this.state.createSpaceOpen ? 
              <CreateSpace 
                onSubmit={this.toggleCreateSpace}
              />
              : null
            }
          </div>
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
              {/*<Link to={`/build/${proj._id}`}>*/}
                <div className={"card investigation-card investigation-card-accented" + ((this.props.selectedProject && this.props.selectedProject._id === proj._id) ? " investigation-card-selected" : null)} 
                  onClick={() => {this.props.onSpaceClick(proj)}}
                  onDoubleClick={ () => {this.props.onSpaceDoubleClick(proj)}}
                >
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
              {/*</Link>*/}
            </div>
          )
        })}
        </div>
      </div>            
    ); 
  }    
}

export default Spaces;