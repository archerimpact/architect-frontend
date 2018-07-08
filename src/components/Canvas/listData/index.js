import React, {Component} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import EntityCard from "../entityCard";

import "./style.css";

class ListData extends Component {

    render() {
        const { graph, data } = this.props;
        return (
            <div className="sidebar-content-container">
                <h5 className="text-center">Graph Entities</h5>
                <div className="searchResults">
                    {
                        data.nodes.map(node => <EntityCard key={node.id} node={node} graph={graph} data={data}/>)
                    }
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(graphActions, dispatch),
        dispatch: dispatch,
    };
}

export default withRouter(connect(mapDispatchToProps)(ListData));