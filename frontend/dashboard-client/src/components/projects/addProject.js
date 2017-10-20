import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './projects.css';

class AddProject extends Component {
	constructor() {
		super();
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
        this.projectSubmit = this.projectSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
		event.preventDefault();
	}

    projectSubmit(event) {
        this.props.submit(this.state.value);
        event.preventDefault();
        this.setState({value: ''});
    }

    render() {
        return (
        	<div className="AddProject">
                <form onSubmit={this.projectSubmit}>
            		<TextField
            			placeholder="Enter project name"
            			value={this.state.value}
            			onChange={this.handleChange}/>
            		<RaisedButton 
                        primary={true} 
                        className="submit" 
                        type="submit"
                        label="New Project" />
            	</form>
                <p>{this.props.name}</p>
            </div>
        );
    }
}

export default AddProject