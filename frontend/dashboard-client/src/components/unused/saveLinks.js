import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';
import { withRouter } from 'react-router-dom';

class SaveLinks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link: {url: '', label: ''},
        };
        this.handleLinkInputChange = this.handleLinkInputChange.bind(this);
        this.handleLabelInputChange = this.handleLabelInputChange.bind(this);
        this.addLink = this.addLink.bind(this);
    };

    handleLinkInputChange(event) {
        this.setState({
            link: {
                ...this.state.link,
                url: event.target.value,
            }
        });
    };

    handleLabelInputChange(event) {
        this.setState({
            link: {
                ...this.state.link,
                label: event.target.value,
            }
        });
    };

    addLink() {
        this.props.dispatch(actions.addLink(this.state.link))
        this.setState({
            link: {
                url: '',
                label: '',
            }
        });
    };

    render() {
        return (
            <div className='rows'>
                <p>
                    A container component connected to the Redux store with synchronous dispatches of links users provide.
                </p>
                <TextField
                  hintText="e.g. https://www.google.com/"
                  floatingLabelText="Add a link"
                  fullWidth={false}
                  value={this.state.link.url}
                  style = {{width: 500, marginRight: 20}}
                  onChange={this.handleLinkInputChange}
                />
                <TextField
                  hintText="e.g. News article on Alice Ma"
                  floatingLabelText="(Optional) Add a note"
                  fullWidth={false}
                  value={this.state.link.label}
                  style = {{width: 300}}
                  onChange={this.handleLabelInputChange}
                />
                <RaisedButton
                  style={{margin: 12} }
                  primary
                  onClick={this.addLink}
                  label="Add" />
                <p> Your Saved Links </p>
                {this.props.savedLinks.links.slice(0).reverse().map((link, id) => {
                    return (
                        <div id={id}>
                            <a href={link.url} target="_blank">{link.url}</a>
                            <p className='p'>Notes: {link.label != null ? link.label:''}</p>
                        </div>
                    );
                })}
          </div>
        );
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedLinks: state.data.savedLinks,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SaveLinks));
