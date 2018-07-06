import React, {Component} from "react";
import { Link } from "react-router-dom";
import Script from 'react-load-script';

// import './style.css';

export default class ParticleBackground extends Component {

    render() {
    	return (
    		<div>
    			<Script url="./js/particles.min.js" onLoad={() => console.log('loaded particles')} />
    		</div>
    	);
	}
}