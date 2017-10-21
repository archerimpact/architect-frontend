import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CreateAccount from '../components/createAccount.js';
import LoginPage from '../components/loginPage.js';

export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Provider store={this.props.store}>
				    <Router>
				    	<div>
				    		<App/>
				    		<Route exact path="/" component={Home} />
				    		<div className="Body">
								<Route path="/links" component={SaveLinks}/>
								<Route exact path="/createaccount" component={ CreateAccount } />
								<Route exact path="/loginpage" component={ LoginPage } />
							</div>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
