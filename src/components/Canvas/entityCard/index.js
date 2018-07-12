import React, {Component} from "react";
import {withRouter,Link} from "react-router-dom";
import {connect} from "react-redux";
import {addToGraphFromId} from "../../../redux/actions/graphActions";
import {fetchCurrentEntity} from "../../../redux/actions/graphSidebarActions";

import "./style.css";

class EntityCard extends Component {

    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    render() {
        const { node } = this.props;
        return (
            <div className="card result-card" key={node.id}>
                <div className="card-header result-card-header flex-row d-flex align-items">
                    <div className="d-flex">
                        <div className="btn btn-primary sign-up-button custom-ali-css2" onClick={() => this.props.dispatch(addToGraphFromId(this.props.graph, node.id))}>
                            Add
                        </div>
                    </div>
                    <Link to="/explore/entity">
                        <span className="collapse-link" onClick={() => this.dispatch(fetchCurrentEntity(node))}>
                            {node.name || node.combined || node.label || node.description}
                        </span>
                    </Link>
                    <div className="card-pills">
                        { !node || !node.programs ?
                            null :
                            (
                                <div className="card-sdn-type">
                                    <p className="sdn-type">
                                        { node && node.programs && node.programs.join('/') }
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div>
                    <div className="card-body result-card-body">
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

export default withRouter(connect(mapDispatchToProps)(EntityCard));
