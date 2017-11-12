import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { register } from "../../server/index";
import { registerAccount } from "../../server/transport-layer";

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
        // TODO: Implement form validation
        var result = registerAccount({username: this.state.email, password: this.state.password});
    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}} >
                <p> Please enter your details below to create a new account. </p>
                    <div style={{width: "400px",
                        margin: "4em auto",
                        padding: "3em 2em 2em 2em",
                        background: "#fafafa",
                        border: "1px solid #ebebeb",
                        boxShadow: "rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px"}} >
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
                    </div>
                <br />
            </div>
        )
    }
}


export default CreateAccount;
