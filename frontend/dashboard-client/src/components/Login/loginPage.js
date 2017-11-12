import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
// import { authenticate } from "../server/index";
import {authenticateAccount} from "../../server/transport-layer";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleEmailInputChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordInputChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        // TODO: Implement form validation
        var self = this;
        var isAuthed = authenticateAccount({username: this.state.email, password: this.state.password});
        isAuthed.then(function(response) {
            if (response.success) {
                // TODO: Route to correct place
                self.props.history.push('/links');
            } else {
                self.props.history.push('/login');
            }
        })

    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}}>
                <p>Welcome back! Please login to access your investigations.</p>
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
                        floatingLabelText="Enter your password"
                        fullWidth={false}
                        value={this.state.pw1}
                        style = {{width: 380, marginRight: 20}}
                        onChange={this.handlePasswordInputChange}
                        type={"password"}
                        name={"password"}
                    />
                    <br />
                    <RaisedButton
                        style={{margin: 15} }
                        primary
                        onClick={this.handleSubmit}
                        label="Login"
                        type="submit"
                    />
                    <br />
                    </div>
            </div>
        );
    }
}

export default LoginPage;