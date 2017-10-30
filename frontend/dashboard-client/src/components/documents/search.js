import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
//import * as server_utils from '../../server/utils';
//import * as actions from '../../actions/';
import ActionHome from 'material-ui/svg-icons/action/home';
import { List, ListItem} from 'material-ui/List';
import {red500, blue500} from 'material-ui/styles/colors';
import './documents.css';
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
        //this.props.submit(this.state.value);
        //var found = server_utils.searchSources(this.state.value);

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
                    //leftIcon={<ActionHome color={blue500} hoverColor={red500}/>}
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
            {this.searchResponses()}
            </div>
        );
    }
}

export default SearchSources