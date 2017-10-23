import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import ProjectPage from '../components/ProjectPage/ProjectPage';
//import SourcePage from '../components/SourcePage/SourcePage'
import App from '../components/App';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

	const muiTheme = getMuiTheme({
	  palette: {
	    primary1Color: '#4CBF88',
	    accent1Color: '#2c98f0'
	  }
	});
	//45AD7C (darker) or 4CBF88 (lighter)


export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Provider store={this.props.store}>
				    <Router>
				    	<div>
				    		<App/>
				    		<Route exact path="/" component={Home} />
				    		<Route exact path="/project/:id" component={ProjectPage} />				    		
							{/*<Route path="/source/:id" component={SourcePage}/>*/}
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
