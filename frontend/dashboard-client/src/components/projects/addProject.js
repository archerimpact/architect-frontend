import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import './projects.css';

class AddProject extends Component {
	constructor() {
		super();
		this.state = {value: ''};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
		event.preventDefault();
	}

    render() {
        return (
        	<div className="AddProject">
        	<form onSubmit={(e) => {
        		this.props.submit(this.state.value);
        		e.preventDefault();
        		this.setState({value: ''});
        	}}>
        		<TextField
        			placeholder="Enter project name"
        			value={this.state.value}
        			onChange={this.handleChange}/>
        		<RaisedButton primary={true} className="submit" type="submit">New Project</RaisedButton>
        	</form>
            <p>{this.props.name}</p>
            </div>
        );
    }
}

export default AddProject