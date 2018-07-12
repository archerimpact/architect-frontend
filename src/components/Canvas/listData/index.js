import React, {Component} from "react";
import levenshtein from 'fast-levenshtein';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import EntityCard from "../entityCard";
import * as Fuse from "fuse.js"
import "./style.css";

const pageHeight = window.innerHeight;

class ListData extends Component {
    constructor(props){
        super(props);
        this.state = {
            listDataSearchResults: []
        }
    }

    fetchListResults = (query) => {
        let nodes = this.props.data.nodes;
        let options = {
            keys: ['name', 'combined', 'label', 'description']
        };
        let fuse = new Fuse(nodes, options);
        return  fuse.search(query);
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
                        this.state.listDataSearchResults.map(node => <EntityCard key={node.id} node={node} graph={graph} data={data}/>)
                            :
                            (this.props.data.nodes.length === 0 ? <div className="placeholder-text" style={{paddingTop: pageHeight / 3}}>This is the <strong>List </strong>tab. <br/><br/>Come here to search nodes that have already been added to your graph.<br/><br/> Select the search tab to begin.</div>:
                            this.props.data.nodes.map(node => <EntityCard key={node.id} node={node} graph={graph} data={data}/>) )

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