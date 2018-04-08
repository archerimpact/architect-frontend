import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { RouterToUrlQuery } from 'react-url-query';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { PersistGate } from 'redux-persist/es/integration/react'
import App from '../'
import './index.css';

// Color options: 45AD7C (darker green) or 4CBF88 (lighter green)
const muiTheme = getMuiTheme({
  fontFamily: "Open Sans, sans-serif",
	palette: {
		accent1Color: '#2c98f0',
	}
});

export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Provider store={this.props.store}>
					<PersistGate loading={<div> Loading... </div>} persistor={this.props.persistor}>
						<Router>
              <RouterToUrlQuery>
  							<div className="app">
  								<App/>
  							</div>
              </RouterToUrlQuery>
						</Router>
					</PersistGate>
				</Provider>
			</MuiThemeProvider>
		);
	};
}
