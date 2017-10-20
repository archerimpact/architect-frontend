import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './ProjectPage/EntitiesTable';
import SourcesTable from './SourcesTable';
import PDFUploader from './pdf_uploader/pdfUploader';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs';

import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (

            <div>
                <div className="App">
                    <div className="summary">
                        <h1>Homepage</h1>         
                    </div>
                    <div className="the-rest" style={{width:'90%', margin:'0 auto'}}>
                        <Tabs tabItemContainerStyle={{background: 'grey'}}>
                            <Tab label="Projects" type="default">
                            <div className="column">
                                <Paper className="projects">
                                    <ProjectList/>
                                </Paper>

                            </div>
                            </Tab>
                            <Tab label="Entities">
                                <div className="column">
                                    <Paper className="projects">
                                        <EntitiesTable />
                                    </Paper>
                                </div>
                            </Tab>
                            <Tab label="Sources">
                                <div className="column">
                                    <PDFUploader />
                                    <p></p>
                                    <Paper className="projects">
                                        <SourcesTable />
                                    </Paper>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home
