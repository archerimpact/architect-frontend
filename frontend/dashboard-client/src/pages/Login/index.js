import React, {Component} from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import {authenticateAccount} from "../../server/auth_routes";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import CreateAccount from "../CreateAccount/";

class Login extends Component {

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
        authenticateAccount({username: this.state.email, password: this.state.password})
        .then(data => {
            if (data.success) {
                this.props.dispatch(actions.userLogIn());
                this.setState({email: '', password: '', redirectToReferrer: true})
            } else {
                this.setState({email: '', password: '', passwordConf: '', error: true})
            }
        })
        .catch(err => console.log('Could not authenticate'))
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
                    <label>Enter your email address</label>
                    <input
                        placeholder="alice@investigator.com"
                        value={this.state.email}
                        style = {{width: 300}}
                        onChange={this.handleEmailInputChange}
                        type="text"
                    />
                    <label>Enter your password</label>
                    <input
                        placeholder="**********"
                        value={this.state.password}
                        style = {{width: 300}}
                        onChange={this.handlePasswordInputChange}
                        type="password"
                    />
                    <button 
                        style={{margin: 15}}
                        onClick={this.handleSubmit}
                        type="submit"
                    >Login </button>
                    <div>
                        <Link to={'/create_account'} style={{color: 'inherit'}}> New around here? Create an Account!</Link>
                    </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
