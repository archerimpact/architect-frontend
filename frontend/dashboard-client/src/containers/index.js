import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import {BrowserRouter as Router, Route} from 'react-router-dom';

export default class Root extends Component {
	render() {
		return (
			<Provider store={this.props.store}>
			    <Router>
			    	<div>
			    		<App/>
			    		<Route exact path="/" component={Home} />
			    		<div className="Body">
							<Route path="/links" component={SaveLinks}/>
						</div>
					</div>
				</Router>
			</Provider>
		);
	}
}
