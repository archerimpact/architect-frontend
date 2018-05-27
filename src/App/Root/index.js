import React, {Component} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { PersistGate } from 'redux-persist/es/integration/react'
import App from '../'

export default class Root extends Component {
	render() {
		return (
				<Provider store={this.props.store}>
					<PersistGate loading={<div> Loading... </div>} persistor={this.props.persistor}>
						<Router>
              <App/>
						</Router>
					</PersistGate>
				</Provider>
		);
	};
}
