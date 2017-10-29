import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CreateAccount from '../components/createAccount';
import LoginPage from '../components/loginPage';
// import EnsureLoggedInContainer from '../containers/ensureLoggedInContainer';
import {isAuthenticated} from "../server/transport-layer";

const requireAuth = (nextState, replace, callback) => {
    // // const { user: { authenticated } } = store.getState();
    // if (!authenticated) {
    //     // Takes a Location object
    //     // https://github.com/mjackson/history/blob/master/docs/Location.md
    //     replace({
    //         pathname: "/login",
    //         state: { nextPathname: nextState.location.pathname }
    //     })
    // }
    // callback()
};

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
                                <Route exact path="/createaccount" component={CreateAccount} />
                                <Route exact path="/loginpage" component={LoginPage} />

                                {/*<Route component={EnsureLoggedInContainer} >*/}
                                    <Route path="/links" component={SaveLinks} /*onEnter={requireAuth}*/ />
                                {/*</Route>*/}
							</div>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
