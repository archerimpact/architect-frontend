import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {addToGraphFromId} from "../../../redux/actions/graphActions";

import EntityAttributes from "../entityAttributes";

import "./style.css";

class EntityCard extends Component {

    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
        this.state = {
            collapsed: true
        }
    }

    toggleCollapse = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    addToGraphFromIdFunc = (graph, id) => {
        if (!this.props.data.nodes.some(e => e.id === this.props.id)) {
            this.dispatch(addToGraphFromId(graph, id))
        }
    };

    render() {
        const { node, graph } = this.props;
        return (
            <div className="card result-card" key={node.id}>
                <div className="card-header result-card-header flex-row d-flex">
                    <div className="d-flex">
                        <div className="icon-div">
                            <i className="entity-icon add-to-graph-icon material-icons"
                               onClick={() => this.addToGraphFromIdFunc(graph, node.id)}>
                               add
                            </i>
                        </div>
                    </div>
                    <span className="collapse-link" onClick={this.toggleCollapse}>
                        {node.name || node.combined || node.number || node.description}
                    </span>
                    <div className="card-pills">
                        <div className="card-sdn-type">
                            <p className="sdn-type">
                                8 links
                            </p>
                        </div>

                        <div className="card-sdn-type">
                            <p className="sdn-type">
                                { node && node.programs && node.programs.join('/') }
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="card-body result-card-body">
                        {
                            this.state.collapsed ?
                            null
                                :
                            <EntityAttributes node={node}/>
                        }
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
