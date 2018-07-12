import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import EntityCard from "../entityCard";

import "./style.css";

const pageHeight = window.innerHeight;

class Entity extends Component {

    // componentDidMount() {
    //     if (this.props.id) {
    //         this.props.dispatch(fetchCurrentEntity(this.props.id))
    //     }
    // }
    //
    // componentWillReceiveProps(nextprops) {
    //     if (this.props.id) {
    //         server.getNode(decodeURIComponent(this.props.id), 1, false)
    //             .then(d => {
    //                 this.setState({currentEntityDegreeOne: d})
    //             })
    //             .catch(err => console.log(err));
    //     }
    // }


    renderEntity = (node, nodes, links, keys) => {
        const nodeMap = {};
        if (node === null || node === undefined) {
            return null
        }
        nodes.forEach(n => nodeMap[n.id] = n.name);

        const extract_link = (type, compareSource, compareTarget) => {
            if (compareTarget) {
                return links.filter(link => link.type === type && node.id === link.source)
                    .map(link => {
                        for (let k=0; k<nodes.length; k++) {
                            if (nodes[k].id === link.target) {
                                return nodes[k]
                            }
                        }
                    })
            } else if (compareSource) {
                return links.filter(link => link.type === type && node.id === link.target)
                    .map(link => {
                        for (let k=0; k<nodes.length; k++) {
                            if (nodes[k].id === link.source) {
                                return nodes[k]
                            }
                        }
                    })
            }
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

        let empty = true;
        const attrs = (<div>
            { keys.filter(k => node[k[0]]).map(k => {
                let n = node;
                const val = n[k[0]];
                empty = false;
                console.log("val",n[k[0]])
                return (
                    <div className="info-row" key={k}>
                        <p className="info-key">{k[1]}</p>
                        { (!(val instanceof Array))
                            ? <p className="info-value">{val.toString()}</p>
                            : val.map(v => <li className="info-value" key={v}>{v}</li>)
                        }
                    </div>
                )
            }) }
        </div>);

        return (
            <div className="full-width">
                <div className="entity-header-wrapper">
                    <div className="entity-header">
                        <div className="entity-name">{node.name || node.combined || node.label || node.description}</div>
                        <div className="entity-type">{node.type}</div>
                    </div>
                </div>
                <hr />
                <div className="entity-body">
                    {
                        empty ?
                            null :
                            <div>
                                <h5 className="subheader">Attributes</h5>
                                {attrs}
                            </div>
                    }
                    <div>
                        { Object.keys(linktypes).filter(l => linktypes[l].extracted.length !== 0).map((l, idx) => {
                            const t = linktypes[l];
                            return (
                                <div key={idx}>
                                    <h5 className="subheader" key={`h5-${idx}`}>{l}</h5>
                                    { t.extracted.map(node =>
                                    <EntityCard key={node.id} node={node} id={node.id} data={this.props.data} shouldFetch graph={this.props.graph} /> )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const { currentEntity } = this.props;
        console.log("currentEntity", currentEntity);
        const keys = [
            ['dateOfBirth', 'Date of Birth'],
            ['placeOfBirth', 'Place of Birth'],
            ['titles', 'Titles'],
            ['emailAddresses', 'Email Addresses'],
            ['websites', 'Websites'],
            ['aliases', 'Aliases'],
            ['programs', 'Programs'],

            ['numberType', 'Document Type'],
            ['valid', 'Valid'],
            ['number', 'Number'],
            ['issuedBy', 'Issuer'],
            ['issuedIn', 'Place of Issue'],
            ['issuedOn', 'Date of Issue'],
            ['notes', 'Notes']
        ];
        if (currentEntity === null) {
            return <div className="sidebar-content-container placeholder-text" style={{paddingTop: pageHeight / 3}}> Click a node to view information about it </div>
        }
        if (currentEntity === false) {
            return null
        }
        let id = currentEntity.id;
        return (
            <div className="sidebar-content-container">
                {this.renderEntity(currentEntity.nodes.filter(n => n.id === id)[0], currentEntity.nodes, currentEntity.links, keys)}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

function mapStateToProps(state) {
    return {
        currentEntity: state.graphSidebar.currentEntity
        // should add currentNode here... but let me first see if that's first actually being used.
        // if not being used, then should only track when sidebar is visible. If it is being used, then always track regardless
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
