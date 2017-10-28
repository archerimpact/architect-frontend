import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';

import ProjectList from '../../containers/ProjectList/';
import './style.css'

class Home extends Component {

    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="app">
                    <div>
                        <h1>Homepage</h1>         
                    </div>
                    <div className="tabs" style={{width:'100%', margin:'0 auto', top: 64}}>
                        <ProjectList/>                        
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
