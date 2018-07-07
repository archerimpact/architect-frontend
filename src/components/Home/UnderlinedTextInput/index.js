import React, {Component} from "react";

import "./style.css";

export default class UnderlinedTextInput extends Component {

	render() {
		return (
		    <div className="group">      
		      <input className="underlined-text-input" type="text" required />
		      <span className="highlight"></span>
		      <span className="bar"></span>
		      <label className="underlined-text-input-label">email address</label>
		    </div>
		)
	}

}