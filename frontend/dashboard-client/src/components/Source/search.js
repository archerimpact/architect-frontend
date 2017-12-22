import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import axios from 'axios';
import './style.css';

class SearchSources extends Component {
	constructor(props) {
		super(props);
		this.state = {value: '', found: [], searched: 0};
		this.searchPhrase = this.searchPhrase.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this);
        this.searchResponses = this.searchResponses.bind(this);
	}

	searchPhrase(event) {
		this.setState({value: event.target.value});
		event.preventDefault();
	}

    searchSubmit(event) {
        var url = 'http://localhost:8000/investigation/searchSources';
        axios.get(url, {
            params: {
                phrase: this.state.value
            }
        })
        .then(function(res) {
            return res.data;
        })
        .then(data => {
            this.setState({found: data, searched:1});
        })
        .catch(function (error) {
            console.log('Error: could not search phrase because: ' + error);
        })

        this.setState({value: ''});
        event.preventDefault();
    }

    searchResponses() {
        if (this.state.found.length === 0 && this.state.searched === 1) {
            return (
                <p>Sorry, this phrase is not found.</p>
                );
        }
        const responseItems = this.state.found.map((doc) => {
            return (
                <ListItem 
                    className="foundDoc" 
                    key={doc} primaryText={doc} 
                />
                );
            });
        return responseItems;
    }

    render() {
        return (
        	<div className="search">
            <form onSubmit={this.searchSubmit}>
        		<TextField
        			placeholder="Enter search phrase"
        			value={this.state.value}
        			onChange={this.searchPhrase}/>
        		<RaisedButton 
                    primary={true} 
                    className="submit" 
                    type="submit"
                    label="Search" />
        	</form>
            <List>
                {this.searchResponses()}
            </List>
            </div>
        );
    }
}

export default SearchSources