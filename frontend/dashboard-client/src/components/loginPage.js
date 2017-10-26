import React from 'react';
import { configData } from '../config.js';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}}>
                <p>Hello! Please login below.</p>
                <form action={configData.backend_url + '/login'} method="post" >
                    <TextField
                        hintText="alice@investigator.com"
                        floatingLabelText="Enter your email address"
                        fullWidth={false}
                        // value={this.state.email}
                        style = {{width: 500, marginRight: 20}}
                        // onChange={this.handleEmailInputChange}
                        type="text"
                        name={"username"}
                    />
                    <br />
                    <TextField
                        hintText="**********"
                        floatingLabelText="Enter your password"
                        fullWidth={false}
                        // value={this.state.pw1}
                        style = {{width: 500, marginRight: 20}}
                        // onChange={this.handlePassword1InputChange}
                        type={"password"}
                        name={"password"}
                    />
                    <br />
                    <RaisedButton
                        style={{margin: 12} }
                        primary
                        // onClick={this.handleSubmit}
                        label="Login"
                        type="submit"
                    />
                    <br />
                </form>
            </div>
        );
    }
}

export default LoginPage;