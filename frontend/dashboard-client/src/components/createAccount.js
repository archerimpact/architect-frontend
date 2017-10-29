import React from 'react';
import { configData } from '../config.js';

// import './App.css';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as actions from '../actions/';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {register} from "../server/index";
// var register = require('../server/index');
import {registerAccount} from "../server/transport-layer";

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConf: ''
        };
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.handlePasswordConfInputChange = this.handlePasswordConfInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleEmailInputChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordInputChange(event) {
        this.setState({password: event.target.value});
    }

    handlePasswordConfInputChange(event) {
        this.setState({passwordConf: event.target.value});
    }

    handleSubmit(event) {
        // check that passwords match etc., validation.
        // if (this.state.pw1 === this.state.pw2) {
        //     console.log(event.target);
        //     const ainfo =2;
        // }
        console.log("handleSubmit");
        // var result = register({username: this.state.email, password: this.state.password});
        var result = registerAccount({username: this.state.email, password: this.state.password});
        console.log(result);
    }

    render() {
        // alert('testing!');
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}} >
                <p> Please enter your details below to create a new account! </p>
                {/*works if you wanna send directly. otherwise handler, pull from state -is this safe?. action={"/register"} method="post" // onSubmit={this.handleSubmit} --- so right now not using the server/index methods */}
                {/*<form action={configData.backend_url + "/register"} method="post" style={{width: "400px",*/}
                    {/*margin: "4em auto",*/}
                    {/*padding: "3em 2em 2em 2em",*/}
                    {/*background: "#fafafa",*/}
                    {/*border: "1px solid #ebebeb",*/}
                    {/*boxShadow: "rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px"}} >*/}
                    <TextField
                        hintText="alice@investigator.com"
                        floatingLabelText="Enter your email address"
                        fullWidth={false}
                        value={this.state.email}
                        style = {{width: 380, marginRight: 20}}
                        onChange={this.handleEmailInputChange}
                        type="text"
                        name={"username"}
                    />
                    <br />
                    <TextField
                        hintText="**********"
                        floatingLabelText="Enter a password"
                        fullWidth={false}
                        value={this.state.password}
                        style = {{width: 380, marginRight: 20}}
                        onChange={this.handlePasswordInputChange}
                        type={"password"}
                        name={"password"}
                    />
                    <br />
                    <TextField
                        hintText="**********"
                        floatingLabelText="Confirm password"
                        fullWidth={false}
                        value={this.state.passwordConf}
                        style = {{width: 380, marginRight: 20}}
                        onChange={this.handlePasswordConfInputChange}
                        type={"password"}
                        name={"password2"}
                    />
                    <br />
                    <RaisedButton
                        style={{margin: 15} }
                        primary
                        onClick={this.handleSubmit}
                        label="Create account"
                        type="submit"
                    />
                    <br />
                {/*</form>*/}
                <br />
            </div>
        )
    }
}


// function mapDispatchToProps(dispatch) {
//     return {
//         actions: bindActionCreators(actions, dispatch),
//         dispatch: dispatch,
//     };
// }
//
// function mapStateToProps(state) {
//     return {
//         createAccount: state.data.createAccount,
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
export default CreateAccount;
