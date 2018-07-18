import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import * as actions from "../../redux/actions/userActions";
import {userLogIn} from "../../redux/actions/userActions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ArcherLogo from "../../images/Archerlogobig.png";
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
        console.log('typing email');
        this.setState({email: event.target.value});
    };

    handlePasswordInputChange = (event) => {
        this.setState({password: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting...');
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
            <div className="row">
                <div>
                    <div className="image-wrapper">
                        <a href="https://www.archerimpact.com/">
                            <img src={ArcherLogo} id="home-image" alt="Archer"/>
                        </a>
                    </div>
                    { this.state.error ? <p> Error! Invalid login or password. Please try again. </p> : null }
                    <form className="login-form">
                        <div className="form-group">
                            <i className="material-icons login-icon">{ this.state.email !== '' ? "perm_identity" : "person" }</i>
                            <input
                                className="form-control sexy-input"
                                placeholder="Email"
                                value={this.state.email}
                                style={{width: 300}}
                                onChange={this.handleEmailInputChange}
                                type="text"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <i className="material-icons login-icon">{ this.state.password !== '' ? "lock_open" : "lock"}</i>
                            <input
                                className="form-control sexy-input"
                                placeholder="Password"
                                value={this.state.password}
                                style={{width: 300}}
                                onChange={this.handlePasswordInputChange}
                                type="password"
                            />
                        </div>

                        <div className="form-group">
                            <button
                                className="btn btn-primary login-btn"
                                onClick={this.handleSubmit}
                            >Login
                            </button>
                        </div>
                    </form>
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
