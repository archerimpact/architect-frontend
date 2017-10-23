import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import ProjectList from '../components/projects/projectList';
import PDFUploader from '../components/pdf_uploader/pdfUploader';
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
				    		<div className="Body">
								<Route path="/links" component={SaveLinks}/>
								<Route path="/projects" component={ProjectList}/>
								<Route path="/investigation/pdf-uploader" component={PDFUploader}/>
							</div>
						</div>
					</Router>
				</Provider>
			</MuiThemeProvider>
		);
	}
}
