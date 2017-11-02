import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { List, ListItem} from 'material-ui/List';
import './style.css';
import 'whatwg-fetch';
var qs = require('qs');

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
        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: qs.stringify({
                phrase: this.state.value
            })
        };
        fetch(url, options)
        .then(res => res.json())
        .then(json => {
            this.setState({found: json, searched: 1});
        })
        .catch(err => {
            console.log('Error: could not add project because: ' + err);
        });

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
                    type="submit">
                    Search
                </RaisedButton>
        	</form>
            <List>
                {this.searchResponses()}
            </List>
            </div>
        );
    }
}

export default SearchSources