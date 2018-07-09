import React, {Component} from "react";
import levenshtein from 'fast-levenshtein';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import EntityCard from "../entityCard";

import "./style.css";

class ListData extends Component {
    constructor(props){
        super(props);
        this.state = {
            listDataSearchResults: []
        }
    }

    getLevenshteinDistance = (node, query) => {
        let sumDistances = 0;
        if (node.hasOwnProperty("name")) {
            for (let i=0; i<node.name.length; i++) {
                let tempDistance = levenshtein.get(node.name.slice(0, i).toLowerCase(), query.toLowerCase())
                if (tempDistance <= 2) {
                    return tempDistance
                }
                sumDistances += tempDistance
            }
            return sumDistances / node.name.length
        } else if (node.hasOwnProperty("combined")) {
            for (let i=0; i<node.combined.length; i++) {
                let tempDistance = levenshtein.get(node.combined.slice(0, i).toLowerCase(), query.toLowerCase())
                if (tempDistance <= 2) {
                    return tempDistance
                }
                sumDistances += tempDistance
            }
            return sumDistances / node.combined.length
        } else if (node.hasOwnProperty("number")) {
            for (let i=0; i<node.number.length; i++) {
                let tempDistance = levenshtein.get(node.number.slice(0, i).toLowerCase(), query.toLowerCase())
                if (tempDistance <= 2) {
                    return tempDistance
                }
                sumDistances += tempDistance
            }
            return sumDistances / node.number.length
        } else if (node.hasOwnProperty("description")) {
            for (let i=0; i<node.description.length; i++) {
                let tempDistance = levenshtein.get(node.description.slice(0, i).toLowerCase(), query.toLowerCase())
                if (tempDistance <= 2) {
                    return tempDistance
                }
                sumDistances += tempDistance
            }
            return sumDistances / node.description.length
        }
    };

    fetchListResults = (query) => {
        let nodes = this.props.data.nodes;
        let searchResults = [];
        searchResults.push({ node: nodes[0], distance: this.getLevenshteinDistance(nodes[0], query) });
        for (let i=1; i<nodes.length; i++) {
            let distance = this.getLevenshteinDistance(nodes[i], query)
            for (let j=0; j<searchResults.length; j++) {
                if (distance <= searchResults[j].distance) {
                    searchResults.splice(j, 0, { node: nodes[i], distance })
                    break;
                }
            }
        }
        return searchResults
    };

    componentWillReceiveProps(nextprops) {
        if (this.props.location.pathname !== nextprops.location.pathname && nextprops.match.params) {
            let nextQuery = nextprops.match.params.query;
            if (nextQuery == null) {
                this.setState({listDataSearchResults: []})
            } else if (nextprops.match.params.sidebarState === 'list') {
                if (this.props.match.params.query !== nextQuery) {
                    this.setState({listDataSearchResults: this.fetchListResults(decodeURIComponent(nextprops.match.params.query))});
                }
            }
        }
    }

    render() {
        const { graph, data } = this.props;
        return (
            <div className="sidebar-content-container">
                <div className="search-results">
                    {
                        this.state.listDataSearchResults.length !== 0 ?
                        this.state.listDataSearchResults.map(nodeDict => <EntityCard key={nodeDict.node.id} node={nodeDict.node} graph={graph} data={data}/>)
                            :
                        this.props.data.nodes.map(node => <EntityCard key={node.id} node={node} graph={graph} data={data}/>)
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