import React, {Component} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import EntityCard from "../entityCard";
import {addToGraphFromId} from "../../../redux/actions/graphActions";

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

        const connected1 = extract_link('connected_to', true, false);
        const connected2 = extract_link('connected_to', false, true);
        const director_of = extract_link('director_of', true, false);
        const director = extract_link('director_of', false, true);

        const linktypes = {
            'Director Of': {
                type: 'director_of',
                extracted: director_of,
                chooseDisplay: 'source',
            },
            'Director': {
                type: 'director_of',
                extracted: director,
                chooseDisplay: 'target',
            },
            ' Connected To ': {
                type: 'connected_to',
                extracted: connected1,
                chooseDisplay: 'target',
            },
            'Connected To': {
                type: 'connected_to',
                extracted: connected2,
                chooseDisplay: 'source',
            }
        };

        let empty = true;
        const attrs = (<div>
            { keys.filter(k => node[k[0]]).map(k => {
                let n = node;
                const val = n[k[0]];
                empty = false;
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

        let nodeInGraph = false;

        for (let i=0; i < this.props.data.nodes.length; i++) {
            if (this.props.data.nodes[i].id === node.id) {
                nodeInGraph = true;
                break
            }
        }

        return (
            <div className="full-width">
                <div className="entity-header-wrapper">
                    <div className="entity-header">
                        <div className="entity-name">{node.name || node.combined || node.label || node.description}</div>
                        <div className="entity-type">{node.type}</div>
                        {
                            nodeInGraph ?
                                null
                                :
                                <div className="btn btn-primary custom-ali-css sign-up-button" onClick={() => this.props.dispatch(addToGraphFromId(this.props.graph, node.id))}>
                                    Add To Graph
                                </div>
                        }
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
        const keys = [
            ['notes', 'Notes'],
            ['accusedOf', 'Accused Of'],
            ['aliases', 'Aliases'],
            ['businessType', 'Business Type'],
            ['companyAddress', 'Company Address'],
            ['agencyAddress', 'Agency Address'],
            ['archiveAddress', 'Archive Address'],
            ['countryOfOperation', 'Country of Operation'],
            ['countryOfOrigin', 'Country of Origin'],
            ['locationOfOperation', 'Location of Operation'],
            ['locationOfOrigin', 'Location of Origin'],
            ['crNumber', 'Company Registration Number'],
            ['industrySector', 'Industry Sector'],
            ['recruitmentSector', 'Recruitment Sector'],
            ['numberOfWorkersSentAbroad', 'Number of Workers Sent Abroad'],
            ['yearsInOperation', 'Years In Operation'],
            ['jointVenture', 'Joint Venture'],
            ['sisterCompany', 'Sister Company'],
            ['phoneNumber', 'Phone Number'],
            ['faxNumber', 'Fax Number'],
            ['governmentIDNumber', 'Government ID Number'],
            ['website', 'Website'],
            ['webSources', 'Web Sources'],
            ['archiveSources', 'Archive Sources']
        ];
        if (currentEntity === null) {
            return <div className="placeholder-text" style={{paddingTop: (pageHeight / 3) + 63}}>This is the <strong>Entity </strong>tab. <br/><br/>Select a node to view information about it. </div>
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
        currentEntity: state.graphSidebar.currentEntity,
        // should add currentNode here... but let me first see if that's first actually being used.
        // if not being used, then should only track when sidebar is visible. If it is being used, then always track regardless
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
