import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import SearchResults from '../../Canvas/searchResults';

import * as actions from '../../../redux/actions/graphActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './style.css';

class Data extends Component {

    constructor(props) {
        super(props);
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
        this.state = {
            expandedCard: null
        }
    }

    handleSearchSubmit(query, dataset) {
        this.props.actions.fetchSearchResults(query, dataset);
        this.setState({
            expandedCard: dataset
        })
    }

    render() {
        return (
            <div className="data-grid y-scrollable">
                {this.props.data.map((data) => {
                    return (
                        <div className="data-card" key={data.name}>
                            <div className="data-card-body">
                                {data.published ? <div className="card-text investigation-card-text status-public">PUBLIC</div> :
                                    <div className="status-private">PRIVATE</div>
                                }
                                <div className="data-card-top d-flex">
                                    <div className="data-card-title">{data.name}</div>
                                    <div className="card-text investigation-card-text detail-info-text">{data.lastUpdated}</div>
                                </div>
                                {/*<SearchBar onSubmit={this.handleSearchSubmit} dataset={data.dataset}/>*/}
                                {data.dataset === this.state.expandedCard ?
                                    <div className="data-card-results">
                                        <SearchResults/>
                                    </div>
                                    : null }
                            </div>
                        </div>
                    )
                })}
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

function mapStateToProps(state, props) {
    return {
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Data));