import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

class SaveLinks extends Component {

    constructor(props) {
        super(props);
        this.state = {
            link: {username: '', password: ''},
        }
    }

    handleUsernameInputChange(event) {
        this.setState({
            link: {
                ...this.state.link,
                username: event.target.value,
            }
        })
    }

    handlePasswordInputChange(event) {
        this.setState({
            link: {
                ...this.state.link,
                password: event.target.value,
            }
        })
    }

    logIn() {
        this.props.dispatch(actions.addLink(this.state.link))
        this.setState({
            link: {
                username: '',
                password: '',
            }
        })
    }

    render() {
        return (
            <div>
                <p>
                    Log in!
                </p>
                <TextField
                  hintText="e.g. https://www.google.com/"
                  floatingLabelText="Add a link"
                  fullWidth={false}
                  value={this.state.link.url}
                  style = {{width: 500, marginRight: 20}}
                  onChange={this.handleUsernameInputChange.bind(this)}
                />
                { ' ' }
                <TextField
                  hintText="e.g. News article on Alice Ma"
                  floatingLabelText="(Optional) Add a note"
                  fullWidth={false}
                  value={this.state.link.label}
                  style = {{width: 300}}
                  onChange={this.handlePasswordInputChange.bind(this)}
                />
                <RaisedButton
                  style={{margin: 12} }
                  primary
                  onClick={this.logIn.bind(this)}
                  label="Add" />
                { ' ' }
          </div>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
