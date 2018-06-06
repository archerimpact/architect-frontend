import React, { Component } from 'react';
import { registerAccount } from "../../server/auth_routes";
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';


class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConf: '',
      error_message: '',
      redirectToReferrer: false
    };
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handlePasswordConfInputChange = this.handlePasswordConfInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailInputChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordInputChange(event) {
    this.setState({ password: event.target.value });
  }

  handlePasswordConfInputChange(event) {
    this.setState({ passwordConf: event.target.value });
  }

  handleSubmit(event) {
    // TODO: Implement form validation
    var self = this;
    registerAccount({ username: this.state.email, password: this.state.password })
      .then(
        data => {
          if (data.success) {
            self.props.dispatch(actions.userLogIn());
            self.setState({ redirectToReferrer: true })
          } else {
            self.setState({ email: '', password: '', passwordConf: '', error: true, error_message: data.message })
          }
        }).catch(err => console.log('Could not create account'))
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return (<Redirect to={from} />);
    }

    return (
      <div className='rows' style={{ textAlign: "center", marginTop: 40 }} >
        <p> Please enter your details below to create a new account. </p>
        {this.state.error ? <p> Error! {this.state.error_message}. Please try again. </p> : []}
        <div style={{
          width: "400px",
          margin: "4em auto",
          padding: "3em 2em 2em 2em",
          background: "#fafafa",
          border: "1px solid #ebebeb",
          boxShadow: "rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px"
        }} >
          <input
            placeholder="alice@investigator.com"
            fullWidth={false}
            value={this.state.email}
            style={{ width: 380, marginRight: 20 }}
            onChange={this.handleEmailInputChange}
            type="text"
            name={"username"}
          />
          <br />
          <input
            placeholder="**********"
            label="Enter a password"
            fullWidth={false}
            value={this.state.password}
            style={{ width: 380, marginRight: 20 }}
            onChange={this.handlePasswordInputChange}
            type={"password"}
            name={"password"}
          />
          <br />
          <input
            placeholder="**********"
            label="Confirm password"
            fullWidth={false}
            value={this.state.passwordConf}
            style={{ width: 380, marginRight: 20 }}
            onChange={this.handlePasswordConfInputChange}
            type={"password"}
            name={"password2"}
          />
          <br />
          <button
            style={{ margin: 15 }}
            primary
            onClick={this.handleSubmit}
            label="Create account"
            type="submit"
          />
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

export default withRouter(connect({}, mapDispatchToProps)(CreateAccount));
