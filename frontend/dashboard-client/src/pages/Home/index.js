import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../redux/actions/';
import {withRouter} from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div style={{height:'100%'}}>
                Activty feed
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
