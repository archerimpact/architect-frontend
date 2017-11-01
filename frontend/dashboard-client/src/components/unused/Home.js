import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './ProjectPage/EntitiesTable';
import SourcesTable from './SourcesTable';
import PDFUploader from './pdf_uploader/pdfUploader';

import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs';

const tab_style = {
	backgroundColor: '#fafafa',
	color:'#747474'
};

class Home extends Component {
	render() {
		return (
			<div style={{height:'100%'}}>
				<div className="app">
					<div className="summary">
						<h1>Homepage</h1>         
					</div>
					<div className="tabs" style={{width:'100%', margin:'0 auto'}}>
						<Tabs >
							<Tab label="Projects" type="default" style={tab_style}>
								<div className="column">
									<Paper className="projects">
										<ProjectList/>
									</Paper>
								</div>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		);
	};
}

export default Home;
