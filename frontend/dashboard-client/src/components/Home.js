import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './ProjectPage/EntitiesTable';
import SourcesTable from './SourcesTable'

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
                        <RaiseButton primary={true} linkButton={true} href="/pdf-uploader" style={{color: 'inherit' }} label="Upload a PDF"/>
                        <p></p>
                    </div>
                    <div className="the-rest">
                        <div className="column">
                            <Paper className="projects">
                                <ProjectList/>
                            </Paper>
                        </div>
                        <div className="column">
                            <Paper className="projects">
                                <EntitiesTable />
                            </Paper>
                        </div>
                        <div className="column">
                            <Paper className="projects">
                                <SourcesTable />
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home
