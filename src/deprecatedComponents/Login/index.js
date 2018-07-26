
import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import * as actions from "../../redux/actions/userActions";
import {userLogIn} from "../../redux/actions/userActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ArcherLogo from "../../../public/Archerlogobig.png";
import "./style.css";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirectToReferrer: false,
            error: '',
        };
    }

    handleEmailInputChange = (event) => {
        this.setState({email: event.target.value});
    };

    handlePasswordInputChange = (event) => {
        this.setState({password: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Implement form validation
        this.props.dispatch(userLogIn(this.state.email, this.state.password))
            .then(data => {
                if (data.success) {
                    this.setState({error: false});
                    console.log('logged in!');
                    this.setState({email: '', password: '', redirectToReferrer: true})
                } else {
                    this.setState({error: data.error});
                    console.log('failed to login!');
                    this.setState({email: '', password: '', passwordConf: '', error: true})
                }
            })
            .catch((err) => {
                console.log('Could not authenticate', err);
                this.setState({error: err});
            });
    };

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/explore/search'}};

        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <div className="flex-row">
                <div className="ml-auto mr-auto">
                    <div style={{maxWidth: 500, marginTop: window.innerHeight / 3}}>
                        <div className="image-wrapper">
                            <a href="https://www.archerimpact.com/">
                                <img src={ArcherLogo} id="home-image" alt="Archer"/>
                            </a>
                        </div>
                        <div style={{textAlign: "center", fontFamily: "Montserrat, sans-serif"}}>
                            { this.state.error ? <p> Error! Invalid login or password. Please try again. </p> : null }
                        </div>
                        <form >
                            <div className="flex-row" style={{justifyContent: "center", marginLeft: -12}}>
                                <i className='material-icons login-icon'>{ this.state.email !== '' ? 'perm_identity' : 'person' }</i>
                                <input
                                    className="form-control sexy-input"
                                    placeholder="Email"
                                    value={this.state.email}
                                    style={{width: 400}}
                                    onChange={this.handleEmailInputChange}
                                    type="text"
                                    autoFocus
                                />
                            </div>

                            <div className="flex-row" style={{justifyContent: "center", marginLeft: -12}}>
                                <i className='material-icons login-icon' style={{fontSize: 22}}>{ this.state.password !== '' ? 'lock_open' : 'lock'}</i>
                                <input
                                    className="form-control sexy-input"
                                    placeholder="Password"
                                    value={this.state.password}
                                    style={{width: 400}}
                                    onChange={this.handlePasswordInputChange}
                                    type="password"
                                />
                            </div>

                            <div className="flex-row">
                                <div className="button-login">
                                    <button
                                        className="btn btn-primary"
                                        onClick={this.handleSubmit}
                                    >Login
                                    </button>
                                </div>
                            </div>
                        </form>
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

export default withRouter(connect(mapDispatchToProps)(Login));