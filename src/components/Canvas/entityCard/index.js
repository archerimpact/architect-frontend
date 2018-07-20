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
        this.nodeInGraph = false;
        for (let i=0; i < this.props.data.nodes.length; i++) {
            if (this.props.data.nodes[i].id === this.props.node.id) {
                this.nodeInGraph = true;
                break
            }
        }
        if (props.node.type === "recruitingAgency") {
            props.node.type = "Recruiting Agency"
        } else if (props.node.type === "company") {
            props.node.type = "Company"
        } else if (props.node.type === "person") {
            props.node.type = "Person"
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log("force-re-render");
    //     return true
    // }

    componentWillReceiveProps(nextProps) {
        this.nodeInGraph = false;
        for (let i=0; i < nextProps.data.nodes.length; i++) {
            if (nextProps.data.nodes[i].id === this.props.node.id) {
                this.nodeInGraph = true;
                break
            }
        }
    }

    toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    render() {
        const { node } = this.props;
        return (
            <div className="card result-card" key={node.id}>
                <div className="card-header result-card-header flex-row d-flex align-items">
                    {
                        this.nodeInGraph ?
                            null
                            :
                            <div className="d-flex">
                                <div className="btn btn-primary sign-up-button custom-ali-css2" onClick={() => this.props.dispatch(addToGraphFromId(this.props.graph, node.id))}>
                                    ADD
                                </div>
                            </div>
                    }
                    <div className="collapse-link">
                        <Link to="/explore/entity">
                            <span onClick={() => this.dispatch(fetchCurrentEntity(node))}>
                                {this.toTitleCase(node.name) || this.toTitleCase(node.combined) || this.toTitleCase(node.label) || this.toTitleCase(node.description)}
                            </span>
                        </Link>
                    </div>
                    <div className="card-pills">
                        { !node || !node.type ?
                            null :
                            (
                                <div className="card-sdn-type">
                                    <p className="sdn-type">
                                        { node && node.type }
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
