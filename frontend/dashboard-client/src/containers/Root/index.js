import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { PersistGate } from 'redux-persist/es/integration/react'

// import { isAuthenticated as isAuthed} from '../../server/transport-layer.js';
import App from '../App/'
import './index.css';
// Color options: 45AD7C (darker green) or 4CBF88 (lighter green)
const muiTheme = getMuiTheme({
	palette: {
		primary1Color: '#4CBF88',
		accent1Color: '#2c98f0'
	}
});

// // const PrivateRoute = ({ component: Component, ...rest }) => (
// //   <Route {...rest} render={props => (
// //     auth.isAuthenticated ? (
// //       <Component {...props}/>
// //     ) : (
// //       <Redirect to={{
// //         pathname: '/login',
// //         state: { from: props.location }
// //       }}/>
// //     )
// //   )}/>
// // )

// const auth = {
//   isAuthenticated: false,
//   authenticate(cb) {
//     // this.isAuthenticated = true
//     isAuthed().then(res =>
//     	this.isAuthenticated = res)
//     .catch(err => console.log(err))
//   },
//   signout(cb) {
//     this.isAuthenticated = false
//     setTimeout(cb, 100)
//   }
// }

export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Provider store={this.props.store}>
					<PersistGate loading={<div> Loading... </div>} persistor={this.props.persistor}>
						<Router>
							<div>
								<App/>
							</div>
						</Router>
					</PersistGate>
				</Provider>
			</MuiThemeProvider>
		);
	};
}
