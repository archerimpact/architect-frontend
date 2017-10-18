import React from 'react';
// import './App.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


export class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            pw1: '',
            pw2: ''
        };
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handlePassword1InputChange = this.handlePassword1InputChange.bind(this);
        this.handlePassword2InputChange = this.handlePassword2InputChange.bind(this);

    }

    handleEmailInputChange(event) {
        this.setState({email: event.target.value});
    }

    handlePassword1InputChange(event) {
        this.setState({pw1: event.target.value});
    }

    handlePassword2InputChange(event) {
        this.setState({pw2: event.target.value});
    }

    handleClick() {
        console.log("handleClick!")
    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}} >
                <p> Please enter your details below to create a new account! </p>
                <TextField
                    hintText="alice@investigator.com"
                    floatingLabelText="Enter your email address"
                    fullWidth={false}
                    value={this.state.email}
                    style = {{width: 500, marginRight: 20}}
                    onChange={this.handleEmailInputChange}
                />
                <br />
                <TextField
                    hintText="**********"
                    floatingLabelText="Enter a password"
                    fullWidth={false}
                    value={this.state.pw1}
                    style = {{width: 500, marginRight: 20}}
                    onChange={this.handlePassword1InputChange}
                />
                <br />
                <TextField
                    hintText="**********"
                    floatingLabelText="Confirm password"
                    fullWidth={false}
                    value={this.state.pw2}
                    style = {{width: 500, marginRight: 20}}
                    onChange={this.handlePassword2InputChange}
                />
                <br />
                <br />
                <RaisedButton
                    style={{margin: 12} }
                    primary
                    onClick={this.handleClick}
                    label="Create account" />
            </div>
        )
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
        createAccount: state.data.createAccount,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
