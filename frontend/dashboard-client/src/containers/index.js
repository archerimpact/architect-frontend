import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import ProjectPage from '../components/ProjectPage';
import Home2 from '../components/Home2';
import DocumentPage from '../components/DocumentPage'
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Root extends Component {
	render() {
		return (
			<MuiThemeProvider>
				<Provider store={this.props.store}>
				    <Router>
				    	<div>
				    		<App/>
				    		<Route exact path="/" component={Home} />

				    		<Route exact path="/project/:id" component={ProjectPage} />
				    		<div className="Body">
								<Route path="/links" component={SaveLinks}/>
							</div>
							<Route path="/home2" component={Home2}/>
							<Route path="/document" component={DocumentPage}/>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
