import React, {Component} from 'react';
import {Redirect, withRouter, Link} from 'react-router-dom';
import {userLogIn} from "../../redux/actions/userActions";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './style.css';
import * as actions from '../../redux/actions/userActions';


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
  }


  render() {
    const {from} = this.props.location.state || {from: {pathname: '/'}};

    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div className="row">
        <div className="col-sm-6 page-col left-col d-flex justify-content-center">
          <img src="https://image.ibb.co/jU5GpS/architect_dark_hex_promo_angle_fixed_01.png" id="tagline-img"
               className="img-fluid"/>
        </div>

        <div className='col-sm-6 page-col right-col d-flex'>
          <h2 className="temp-logo">Architect</h2>
          { this.state.error ? <p> Error! Invalid login or password. Please try again. </p> : [] }

          <form className="login-form">
            <div className="form-group row">
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

            <div className="form-group row">
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

            <div className="form-group row">
              <button
                className="btn btn-primary login-btn"
                onClick={this.handleSubmit}
              >Login
              </button>
            </div>

            <button
              className="btn btn-primary"
              style={{margin: 15}}
              onClick={this.handleSubmit}
            >Sign Up
            </button>

            <div>
              <Link to={'/create_account'} style={{color: 'inherit'}}> New around here? Create an Account!</Link>
            </div>
          </form>
          <img src="https://preview.ibb.co/egm3KS/gradient_real_bottom_graph.png" id="right-img" className=""/>
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
