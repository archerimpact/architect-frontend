import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Redirect} from 'react-router'; //ADDED THIS FOR AUTH ATTEMPT
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CreateAccount from '../components/createAccount';
import LoginPage from '../components/loginPage';
// import EnsureLoggedInContainer from '../containers/ensureLoggedInContainer';
import {isAuthenticated} from "../server/transport-layer";

// const requireAuth = (nextState, replace, callback) => {
//     // // const { user: { authenticated } } = store.getState();
//     // if (!authenticated) {
//     //     // Takes a Location object
//     //     // https://github.com/mjackson/history/blob/master/docs/Location.md
//     //     replace({
//     //         pathname: "/login",
//     //         state: { nextPathname: nextState.location.pathname }
//     //     })
//     // }
//     // callback()
//
// };
// note onEnter, browserHistory do not exist in RR4.

export default class Root extends Component {
    render() {
		return (
			<MuiThemeProvider>
				<Provider store={this.props.store}>
				    <Router>
				    	<div>
				    		<App/>
				    		{/*<Route exact path="/" component={Home} />*/}
				    		<Route exact path="/" render={() => (
                            isAuthenticated().success ? (
                                <Redirect to="/links" />
                            ) : (
                                <Home />
                            )
                            )}/>

				    		<div className="Body">
                                <Route exact path="/createaccount" component={CreateAccount} />
                                <Route exact path="/loginpage" component={LoginPage} />

                                {/*<Route component={EnsureLoggedInContainer} >*/}
                                    <Route path="/links" component={SaveLinks} />
                                {/*</Route>*/}
							</div>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
