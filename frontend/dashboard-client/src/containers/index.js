import React, {Component} from 'react';
import { Provider } from 'react-redux';
import './index.css';
import Home from '../components/Home';
import ProjectPage from '../components/ProjectPage/ProjectPage';
import Home2 from '../components/Home2';
import DocumentPage from '../components/DocumentPage/DocumentPage'
import App from '../components/App';
import SaveLinks from '../components/saveLinks';
import ProjectList from '../components/projects/projectList';
import PDFUploader from '../components/pdf_uploader/pdfUploader';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

	const muiTheme = getMuiTheme({
	  palette: {
	    primary1Color: '#4CBF88'
	  }
	});


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
				    		<div className="Body">
								<Route path="/links" component={SaveLinks}/>
								<Route path="/projects" component={ProjectList}/>
								<Route path="/pdf-uploader" component={PDFUploader}/>
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
