import React, {Component} from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import { authenticateAccount } from "../../server/auth_routes";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './style.css';
import * as actions from '../../redux/actions/';


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirectToReferrer: false,
            error: '',
        };
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailInputChange(event) {
        console.log('typing email');
        this.setState({email: event.target.value});
    }

    handlePasswordInputChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log('Submitting...');
        // TODO: Implement form validation
        authenticateAccount({
            username: this.state.email,
            password: this.state.password
        }).then(data => {
            if (data.success) {
                this.setState({error: false});
                console.log('logged in!');
                this.props.dispatch(actions.userLogIn());
                this.setState({email: '', password: '', redirectToReferrer: true})
            } else {
                this.setState({error: data.error});
                console.log('failed to login!');
                this.setState({email: '', password: '', passwordConf: '', error: true})
            }
        })
        .catch((err, i) => {
            console.log('Could not authenticate');
            this.setState({error: err.response.data});
        });
    }



    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };

        if (this.state.redirectToReferrer) {
          return (
            <Redirect to={from}/>
          )
        }

        return (
            <div className="row">
                <div className="col-sm-6 page-col left-col d-flex justify-content-center">
                    <div className="explore-tagline tagline">
                        <i className="fa fa-binoculars large-fa-icon"></i>
                        <h4>Explore public data.</h4>
                    </div>
                    <div className="build-tagline tagline">
                        <i className="fa fa-building large-fa-icon"></i>
                        <h4>Build investigations.</h4>
                    </div>
                    <div className="publish-tagline tagline">
                        <i className="fa fa-newspaper large-fa-icon"></i>
                        <h4>Publish information.</h4>
                    </div>
                </div>

                <div className='col-sm-6 page-col right-col d-flex justify-content-center'>
                    { this.state.error ? <p> Error! Invalid login or password. Please try again. </p> : [] }

                    <form>
                        <div className="form-group">
                            <input
                                className="form-control sexy-input"
                                placeholder="Email"
                                value={this.state.email}
                                style = {{width: 300}}
                                onChange={this.handleEmailInputChange}
                                type="text"
                            />
                        </div>
                        
                        <div className="form-group">
                            <input
                                className="form-control sexy-input"
                                placeholder="Password"
                                value={this.state.password}
                                style = {{width: 300}}
                                onChange={this.handlePasswordInputChange}
                                type="password"
                            />
                        </div>

                        <button 
                            className="btn btn-outline-primary"
                            style={{margin: 15}}
                            onClick={this.handleSubmit}
                        >Login </button>


                        {/* this should go to create_account */}
                        <button 
                            className="btn btn-primary"
                            style={{margin: 15}}
                            onClick={this.handleSubmit} 
                        >Sign Up </button>
                        
                        {/*}
                        <div>
                            <Link to={'/create_account'} style={{color: 'inherit'}}> New around here? Create an Account!</Link>
                        </div>
                        */}
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

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        savedSources: state.data.savedSources
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
