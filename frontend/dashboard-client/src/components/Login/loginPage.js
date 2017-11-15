import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Redirect, withRouter, Link } from 'react-router-dom';
// import { authenticate } from "../server/index";
import {authenticateAccount} from "../../server/auth_routes";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import CreateAccount from "./createAccount";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirectToReferrer: false,
            error: false
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
        authenticateAccount({username: this.state.email, password: this.state.password})
        .then(data => {
            if (data.success) {
                self.props.dispatch(actions.userLogIn());
                self.setState({email: '', password: '', redirectToReferrer: true})
            } else {
                debugger
                self.setState({password: '', error: true})
            }
        })
        .catch(err => console.log('Could not authenticate'))
        // isAuthed.then(function(response) {
        //     if (response.success) {
                
        //         // TODO: Route to correct place
        //         // <Redirect to={'/'}/>;
        //     } else {
        //         console.log('err')
        //     }
        // })

    }



    render() {

        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const { redirectToReferrer } = this.state;

        if (redirectToReferrer) {
          return (
            <Redirect to={from}/>
          )
        }

        return (
            <div className='rows' style={{textAlign:"center", marginTop:40}}>
                <p>Welcome back! Please login to access your investigations.</p>
                {this.state.error ? <p> Error! Invalid login or password. Please try again. </p>:[]}
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
                        value={this.state.password}
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
                        <br />
                        <br />
                        <Link to={'/create_account'}> <RaisedButton
                            style={{margin: 15} }
                            primary
                            label="New? Create an Account!"
                            type="button"
                        />
                        </Link>

                    </div>
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
        savedEntities: state.data.savedEntities,
        savedSources: state.data.savedSources
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginPage));
