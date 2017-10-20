import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './ProjectPage/EntitiesTable';
import DocumentsTable from './DocumentsTable'

import RaiseButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper'

import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <div className="App">
                    <div className="summary">
                        <h1>Homepage</h1>
                        <Link to="/project/0" style={{color: 'inherit'}}>Go to Test Project</Link>
                        <p></p>           
                        <RaiseButton primary={true} linkButton={true} href="/pdf-uploader" style={{color: 'inherit' }} label="Upload a PDF"/>
                        <p></p>
                    </div>
                    <div className="the-rest">
                        <div className="column">
                            <ProjectList/>
                        </div>
                        <div className="column">
                            <Paper className="projects">
                                <h3>Entities</h3>
                                <EntitiesTable />
                            </Paper>
                        </div>
                        <div className="column">
                            <Paper className="projects">
                                <h3>Sources</h3>
                                <Link to="/links" style={{color: 'inherit' }}>View saved links</Link>
                                <p></p>  
                                <DocumentsTable />
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home
