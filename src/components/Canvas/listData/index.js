import React, {Component} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import EntityCard from "../entityCard";

import "./style.css";

class ListData extends Component {

    render() {
        if (this.props.data === null) {
            return (
                <div> Loading... </div>
            );
        } else {
            return (
                <div className="sidebar-content-container">
                    <h5 className="text-center">Entities</h5>
                    <div className="searchResults">
                        { !this.props.data || !this.props.data.nodes ?
                            null :
                            this.props.data.nodes.map(node => <EntityCard key={node.id} data={node} id={node.id}
                                                                                      shouldFetch
                                                                                      graph={this.props.graph}/>)
                        }
                    </div>
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(graphActions, dispatch),
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        data: state.graph.data,
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListData));