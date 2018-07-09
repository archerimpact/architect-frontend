import React, { Component } from "react";
import { fetchEntity, reorderEntityCache } from "../../../redux/actions/graphActions";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const attrKeys = [
    ['registered_in', 'Registered In'],
    ['dateOfBirth', 'Date of Birth'],
    ['gender', 'Gender'],
    ['titles', 'Title'],
    ['place_of_birth', 'Place of Birth'],
    ['last_seen', 'Last Seen'],
    ['incorporation_date', 'Incorporation Date']
];

class EntityAttributes extends Component {
    constructor(props){
        super(props);
        this.state = {
            entityData: null
        };
    }

    componentDidMount() {
        const { dispatch, node, entityCache } = this.props;
        let i;
        for (i=0; i<entityCache.length; i++) {
            if (entityCache[i].id === node.id) {
                this.state.entityData = entityCache[i];
                break;
            }
        }
        if (this.state.entityData !== null) {
            dispatch(fetchEntity(node.id));
            this.state = entityCache[0]
        } else {
            dispatch(reorderEntityCache(node.id, i));
        }
    }

    render() {
        const { node } = this.props;
        console.log("entityData", this.state.entityData);
        // now just display the damn data.
        return (
            <div>
                {
                    attrKeys.filter(key => node[key[0]]).map(key => {
                        const val = node[key[0]];
                        return (
                            <div className="info-row" key={key}>
                                <p className="info-key">{key[1]}:</p>
                                { (!(val instanceof Array))
                                    ? <p className="info-value">{val}</p>
                                    : <div className="info-value-list"> {val.map(v => <div className="info-value" key={v}>{v}</div>)} </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        entityCache: state.graph.entityCache
    };
}

export default withRouter(connect(mapDispatchToProps, mapStateToProps)(EntityAttributes));