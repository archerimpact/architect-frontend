import React, {Component} from "react";
import EntityCard from "../entityCard";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import "./style.css";

class BackendSearch extends Component {
    render() {
        if (this.props.searchData === null) {
            return (
                <div>Loading...</div>
            );
        } else {
            return (
                <div className="search-results">
                    {
                        this.props.searchData.map((entity) => {
                            return (
                                <EntityCard key={entity.id} node={entity} data={this.props.data} graph={this.props.graph}/>
                            );
                        })
                    }
                    { this.props.searchData.length === 50 ? 
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
        searchData: state.graph.canvas.searchData
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackendSearch));