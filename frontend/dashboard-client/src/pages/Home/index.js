import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import {withRouter} from 'react-router-dom';
import ProjectList from './ProjectList/';
import './style.css'

class Home extends Component {
    render() {
        return (
            <div style={{height:'100%'}}>
                <div className="app">
                    <div style={{width:'100%', margin:'0 auto', top: 64}}>
                        <ProjectList {...this.props} />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
