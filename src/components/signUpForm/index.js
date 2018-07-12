import React, {Component} from "react";
import { submitEmail } from "../../redux/actions/graphActions";

import "./style.css";

export default class SignUpForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailSubmitted: false,
    }
  }

  handleEmailChange = (val) => {
    this.setState({email: val});
  }

  submitEmailToBackend = async (email) => {
    const response = await submitEmail(email)
    if (response.status === 200) {
      this.setState({emailSubmitted: true})  
    }
  }

  render = () => {
    if (this.state.emailSubmitted) {
      return (
        <p className="bottombar-text">Thanks!</p>
      )
    }
    else {
      const useClass = this.props.naked ? "bottombar" : "sign-up";
      return (
        <form className={ useClass + "-form" }>
          <input className={ useClass + "-input form-control" } type="email" placeholder="Email address" onChange={(e) => this.handleEmailChange(e.target.value)} />
          <div className={ useClass + "-button btn btn-primary" } onClick={() => this.submitEmailToBackend(this.state.email)}>
            { this.props.naked ? 
              <i className="bottombar-submit material-icons">send</i>
              :
              <span>Subscribe</span>
            }
          </div>
        </form>
      );
    }
  }
}