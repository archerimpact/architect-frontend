import React, { Component } from 'react'; 

import './style.css'; 

import { Link } from 'react-router-dom';  

class Project extends Component {

  render(){
    const node = this.props.node
    const iconType = 'folder-o';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginLeft: '5px', marginRight: '5px'};
    const pathname = '/'+ node.name + '/'+ node.pid;
    return (
      <div className="elementContainer" onClick={() => {this.props.onProjectSelect(node._id)}}>
        <div >
            <i className={iconClass} style={iconStyle}/>
            <span className="elem">{node.name}</span>
        </div>
      </div>
    );
  }
}

export default Project