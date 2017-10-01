import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import App from '../components/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Provider store={this.props.store}>
					<App />
				</Provider>
			</MuiThemeProvider>
		);
	}
}
