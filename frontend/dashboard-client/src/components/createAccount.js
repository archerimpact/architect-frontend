import React from 'react';
import { configData } from '../config.js';

// import './App.css';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as actions from '../actions/';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


class CreateAccount extends React.Component {
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
        this.handleSubmit = this.handleSubmit.bind(this);

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

    handleSubmit(event) {
        // check that passwords match etc., validation.
        // if (this.state.pw1 === this.state.pw2) {
        //     console.log(event.target);
        //     const ainfo =2;
        // }
        console.log(event.target);
    }

    render() {
        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}} >
                <p> Please enter your details below to create a new account! </p>
                {/*works if you wanna send directly. otherwise handler, pull from state -is this safe?. action={"/register"} method="post" // onSubmit={this.handleSubmit} --- so right now not using the server/index methods */}
                <form action={configData.backend_url + "/register"} method="post" >
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
                        floatingLabelText="Enter a password"
                        fullWidth={false}
                        // value={this.state.pw1}
                        style = {{width: 500, marginRight: 20}}
                        // onChange={this.handlePassword1InputChange}
                        type={"password"}
                        name={"password"}
                    />
                    <br />
                    <TextField
                        hintText="**********"
                        floatingLabelText="Confirm password"
                        fullWidth={false}
                        // value={this.state.pw2}
                        style = {{width: 500, marginRight: 20}}
                        // onChange={this.handlePassword2InputChange}
                        type={"password"}
                        name={"password2"}
                    />
                    <br />
                    <RaisedButton
                        style={{margin: 12} }
                        primary
                        // onClick={this.handleSubmit}
                        label="Create account"
                        type="submit"
                    />
                    <br />
                </form>
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
