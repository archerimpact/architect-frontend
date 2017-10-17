import React, { Component } from 'react';
import '../App.css';

import RaisedButton from 'material-ui/RaisedButton';

import * as server from '../../server/'

class EntityExtractor extends Component{

	constructor(props) {
    	super(props);
      this.handleSubmit = this.handleSubmit.bind(this)
    	this.state = {
      		text: "Submit text to extract entities.",
          entities: []
    	}
    }

  handleChange = (event) => {
    	this.setState({text: event.target.value})
  	}

  handleSubmit = (event) => {
    	alert('An essay was submitted: ' + this.state.text);
    	event.preventDefault();
      server.postProject("Random Title", this.state.text)
        .then((data) => {
            console.log("posted data: " + data);
        })
        .catch((error) => {
          console.log("found an error: " + error)
        })
  	}

	render() {
		return(
        <div>
      		<textarea className="add-text" value={this.state.text} onChange={this.handleChange} />
    		  <RaisedButton label="Extract" onClick = {this.handleSubmit}/>
        </div>
		)
	}
}

export default EntityExtractor