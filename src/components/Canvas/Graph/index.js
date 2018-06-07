import React, {Component} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import {
    addToGraphFromId,
    resetProjectDispatch,
    saveCurrentProjectData,
    setCurrentNode,
    // initializeCanvas
} from "../../../redux/actions/graphActions";

import "./graph.css";
import "./style.css";

class Graph extends Component {

    setCurrentNodeFunc = (d) => {
        this.props.dispatch(setCurrentNode(d));
    }

    expandNodeFromData = (d) => {
        this.props.dispatch(addToGraphFromId(this.props.graph, d.id));
    }

    saveCurrentProjectDataFunc = () => {
        this.props.dispatch(saveCurrentProjectData(this.props.graph));
    }

    componentDidMount() {
        // this.props.dispatch(initializeCanvas(this.props.graph, this.props.width, this.props.height));
        this.props.graph.generateCanvas(this.props.width, this.props.height);
        this.props.graph.setData(0, [], []);
        this.props.graph.bindDisplayFunctions({
            expand: this.expandNodeFromData,
            node: this.setCurrentNodeFunc,
            save: this.saveCurrentProjectDataFunc
        });

        if (this.props.graphData !== null) {
            const graphData = {nodes: this.props.graphData.nodes, links: this.props.graphData.links};
            this.props.graph.setData(graphData.centerid, this.makeDeepCopy(graphData.nodes), this.makeDeepCopy(graphData.links));
        }
    }

    componentWillReceiveProps(nextprops) {
        this.props.graph.bindDisplayFunctions({
            expand: this.expandNodeFromData,
            node: this.setCurrentNodeFunc,
            save: this.saveCurrentProjectDataFunc
        });

        if (this.props.project && nextprops.graphData && nextprops.project && nextprops.project._id !== this.props.project._id) {
            const graphData = {nodes: nextprops.graphData.nodes, links: nextprops.graphData.links};
            this.props.graph.setData(graphData.centerid, this.makeDeepCopy(graphData.nodes), this.makeDeepCopy(graphData.links));
        }
    }

    makeDeepCopy(array) {
        var newArray = [];
        array.map((object) => {
            return newArray.push(Object.assign({}, object));
        });
        return newArray;
    }

    renderProjectToolbar = () => {
        return (
            <div className="back-button" onClick={() => {
                this.props.dispatch(resetProjectDispatch())
                this.props.history.push('/build')
            }
            }>
                <i className="material-icons back-button-icon">home</i>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.props.project && this.props.match.path !== "/explore/:sidebarState?" ? this.renderProjectToolbar() :
                    null
                }
                <div id="graph-container" style={{"height": this.props.height + "px", "width": this.props.width + "px"}}></div>
                {/* Note - this is used for graph injection */}
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

function mapStateToProps(state) {
    let sidebarSize = state.graph.sidebarVisible ? 600 : 0;
    let graphData = null;
    if (state.project.currentProject != null && state.graph.data != null) {
        // TODO this is called a lot
        graphData = state.graph.data;
    }
    return {
        height: window.innerHeight,
        width: Math.max(window.innerWidth - sidebarSize),
        project: state.project.currentProject,
        graphData: graphData
    };
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Graph));
