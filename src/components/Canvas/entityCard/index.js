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
        this.dispatch(addToGraphFromId(graph, id))
    };

    render() {
        const { data, graph } = this.props;
        return (
            <div className="card result-card" key={data.id}>
                <div className="card-header result-card-header flex-row d-flex">
                    <div className="d-flex">
                        <div className="icon-div">
                            <i className="entity-icon add-to-graph-icon material-icons"
                               onClick={() => this.addToGraphFromIdFunc(graph, data.id)}>
                               add
                            </i>
                        </div>
                    </div>
                    <span className="collapse-link" onClick={this.toggleCollapse}>
                        {data.name || data.combined || data.number || data.description}
                    </span>
                    <div className="ml-auto card-program">
                        <small className="card-sdn-type">
                            {data.dataset}
                        </small>
                    </div>
                </div>
                <div className={this.state.collapsed ? 'collapse' : null}>
                    <div className="card-body result-card-body">
                        <EntityAttributes node={data}/>
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
