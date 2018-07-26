import React, {Component} from "react";
import EntityCard from "../entityCard";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import ReactLoading from "react-loading";

import "./style.css";

const pageHeight = window.innerHeight;

class BackendSearch extends Component {
    render() {
        if (this.props.loading == null) {
            return (
            <div className="placeholder-text" style={{paddingTop: pageHeight / 3}}>This is the <strong>Search</strong> tab. <br/><br/>Search nodes and explore links in Archer's reconstructed OFAC database.</div>
            );
        } else {
            return (
                <div className="search-results">
                    {
                        this.props.loading ?
                            <div className="around-loading">
                                <ReactLoading type="spin" color="#0D77E2" height={50} width={50} className="spinning-svg"/>
                            </div>
                            :
                            this.props.searchData.length === 0 ? <div className="placeholder-text" style={{paddingTop: pageHeight / 3}}>No Results</div>: this.props.searchData.map((entity) => {
                                return (
                                    <EntityCard key={entity.id} node={entity} data={this.props.data} graph={this.props.graph}/>
                                );
                            })
                    }
                    { !this.props.loading && this.props.searchData.length === 50 ?
                        <p className="paging-coming-soon">(Showing top 50 results)</p>
                        :
                        null
                    }
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        loading: state.graph.canvas.loading,
        searchData: state.graph.canvas.searchData
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch));