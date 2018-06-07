import React, {Component} from "react";

import "./style.css";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actions from "../../../redux/actions/userActions";
import {withRouter} from "react-router-dom";
import EntityCard from "../EntityCard";
import EntityAttributes from "../EntityAttributes";
import * as server from "../../../server";


// const tab_style = {
//   backgroundColor: '#FFFFFF',
//   color: '#747474'
// };

class Entity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentEntity: null,
        };
    }

    componentWillMount() {
        server.getNode(decodeURIComponent(this.props.id), false)
        .then(d => {
            this.setState({currentEntity: d})
        })
        .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextprops) {
        server.getNode(decodeURIComponent(this.props.id), false)
        .then(d => {
            this.setState({currentEntity: d})
        })
        .catch(err => console.log(err));
    }


    renderEntity = (node, nodes, links, keys) => {
        const nodeMap = {};
        if (node === null || node === undefined) {
            return null
        }
        nodes.forEach(n => nodeMap[n.id] = n.name);

        const extract_link = (type, compareSource, compareTarget) => {
            return links.filter(link => link.type === type &&
                (
                    (compareSource && node.id === link.source) ||
                    (compareTarget && node.id === link.target)
                )
            );
        };

        const aliases = extract_link('AKA', true, false);
        const documents = extract_link('HAS_ID_DOC', true, false);
        const locations = extract_link('HAS_KNOWN_LOCATION', true, false);
        const sanctions = extract_link('SANCTIONED_ON', true, false);

        const part_ofs = extract_link('SIGNIFICANT_PART_OF', true, false);
        const contains = extract_link('SIGNIFICANT_PART_OF', false, true);

        const supporting = extract_link('PROVIDING_SUPPORT_TO', true, false);
        const supported = extract_link('PROVIDING_SUPPORT_TO', false, true);

        const owned = extract_link('OWNED_BY', true, false);
        const owns = extract_link('OWNED_BY', false, true);

        const subservants = extract_link('LEADER_OF', true, false);
        const leaders = extract_link('LEADER_OF', false, true);

        const acting = extract_link('ACTING_FOR', true, false);
        const action_received = extract_link('ACTING_FOR', false, true);

        const associates = extract_link('ASSOCIATE_OF', false, true);
        const related = extract_link('RELATED_TO', false, true);

        const maybe_sames = links.filter(link => link.type === link.type.startsWith('MATCHED_') && node.id === link.source);

        const linktypes = {
            'Documents': {
                type: 'HAS_ID_DOC',
                extracted: documents,
                chooseDisplay: 'target',
            },
            'Locations': {
                type: 'HAS_KNOWN_LOCATION',
                extracted: locations,
                chooseDisplay: 'target',
            },
            'Sanctioned On': {
                type: 'SANCTIONED_ON',
                extracted: sanctions,
                chooseDisplay: 'target',
            },
            'Significant Part Of': {
                type: 'SIGNIFICANT_PART_OF',
                extracted: part_ofs,
                chooseDisplay: 'target',
            },
            'Significantly Contains': {
                type: 'SIGNIFICANT_PART_OF',
                extracted: contains,
                chooseDisplay: 'source',
            },
            'Providing Support To': {
                type: 'PROVIDING_SUPPORT_TO',
                extracted: supporting,
                chooseDisplay: 'target',
            },
            'Supported By': {
                type: 'PROVIDING_SUPPORT_TO',
                extracted: supported,
                chooseDisplay: 'source',
            },
            'Owned By': {
                type: 'OWNED_BY',
                extracted: owned,
                chooseDisplay: 'target',
            },
            'Owns': {
                type: 'OWNED_BY',
                extracted: owns,
                chooseDisplay: 'source',
            },
            'Leader Of': {
                type: 'LEADER_OF',
                extracted: subservants,
                chooseDisplay: 'target',
            },
            'Lead By': {
                type: 'LEADER_OF',
                extracted: leaders,
                chooseDisplay: 'source',
            },
            'Acting For': {
                type: 'ACTING_FOR',
                extracted: acting,
                chooseDisplay: 'target',
            },
            'Receives Actions From': {
                type: 'ACTING_FOR',
                extracted: action_received,
                chooseDisplay: 'source',
            },
            'Associate Of': {
                type: 'ASSOCIATE_OF',
                extracted: associates,
                chooseDisplay: 'source',
            },
            'Related To': {
                type: 'RELATED_TO',
                extracted: related,
                chooseDisplay: 'source',
            },
            'Aliases': {
                type: 'AKA',
                extracted: aliases,
                chooseDisplay: 'target',
            },
            'Possibly Same As': {
                type: '',
                extracted: maybe_sames,
                chooseDisplay: 'target',
            }
        };

        const attrs = <EntityAttributes node={node}/>;

        return (
            <div className="full-width">
                <div className="entity-header-wrapper">
                    <div className="entity-header">
                        <div
                            className="entity-name">{node.name || node.combined || node.number || node.description}</div>
                        <div className="entity-type">({node.type})</div>
                    </div>
                    <div className="entity-source">{node.dataset}</div>
                </div>
                <hr />
                <div className="entity-body">

                    <h5 className="">Attributes</h5>
                    { attrs }

                    { Object.keys(linktypes).filter(l => linktypes[l].extracted.length !== 0).map((l, idx) => {
                        const t = linktypes[l];
                        return (
                            <div key={idx}>
                                <h5 className="subheader" key={`h5-${idx}`}>{l}</h5>
                                { t.extracted.map(i => <EntityCard key={i[t.chooseDisplay]} data={i} id={i[t.chooseDisplay]} shouldFetch
                                                                   graph={this.props.graph}/>) }
                            </div>
                        );
                    })}

                </div>
            </div>
        )
    }

    render() {
        const keys = [
            ['registered_in', 'Registered In'],
            ['birthdate', 'Date of Birth'],
            ['gender', 'Gender'],
            ['place_of_birth', 'Place of Birth'],
            ['last_seen', 'Last Seen'],
            ['incorporation_date', 'Incorporation Date']
        ];
        if (this.state.currentEntity === null) {
            return <div className="sidebar-content-container"> Click a node to view information about it </div>
        }
        let id = decodeURIComponent(this.props.match.params.query);
        return (
            <div className="sidebar-content-container">
                {this.renderEntity(this.state.currentEntity.nodes.filter(n => n.id === id)[0], this.state.currentEntity.nodes, this.state.currentEntity.links, keys)}
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
        currentNode: state.project.currentProject.currentNode,
        currentEntity: state.graph.currentEntity
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
