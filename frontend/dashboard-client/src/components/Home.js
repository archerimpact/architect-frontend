import React, { Component } from 'react';

import './App.css'

import ProjectList from './projects/projectList.js';
import EntitiesTable from './Entity/';
import SourcesTable from './SourcesTable';
import PDFUploader from './pdf_uploader/pdfUploader';

import Paper from 'material-ui/Paper'
import {Tabs, Tab} from 'material-ui/Tabs';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/';

const tab_style = {
    backgroundColor: '#fafafa',
    color:'#747474'
}

class Home extends Component {

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="app">
                    <div className="summary">
                        <h1>Homepage</h1>         
                    </div>
                    <div className="tabs" style={{width:'100%', margin:'0 auto', top: 64}}>
                        <ProjectList/>
                        
                            {/*TODO: change the home page to make more sense
                            <Tabs >
                            <Tab label="Projects" type="default" style={tab_style}>
                                <div className="column">
                                    <Paper className="projects">
                                        <ProjectList/>
                                    </Paper>
                                </div>
                            </Tab>
                            <Tab label={"Entities (" + this.props.savedEntities.entities.length + ")"} style={tab_style}>
                                <div className="column">
                                    <Paper className="projects">
                                        <EntitiesTable />
                                    </Paper>
                                </div>
                            </Tab>
                            <Tab label="Sources" style={tab_style}>
                                <div className="column">
                                    <PDFUploader />
                                    <p></p>
                                    <Paper className="projects">
                                        <SourcesTable />
                                    </Paper>
                                </div>
                            </Tab>
                        </Tabs>*/}
                        
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        savedEntities: state.data.savedEntities,
        savedSources: state.data.savedSources
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
