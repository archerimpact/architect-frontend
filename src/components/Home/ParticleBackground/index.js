import React, {Component} from "react";
import { Link } from "react-router-dom";
import Script from 'react-load-script';

import './style.css';

export default class ParticleBackground extends Component {

    render() {
    	return (
    		<div>
          <div id="particles-js"></div>
    			<Script url="./js/particles.min.js" onLoad={() => console.log('loaded particles')} />
          <Script url="./js/particles-instance.min.js" onLoad={() => console.log('loaded particle constants')} defer="defer"/>
    		</div>
    	);
	}
}