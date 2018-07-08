import React, {Component} from "react";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import {
    addToGraphFromId,
    setCurrentNode
} from "../../../redux/actions/graphActions";

import "./graph.css";
import "./style.css";

const windowHeight = window.innerHeight;
const windowWidth = Math.max(window.innerWidth);

class Graph extends Component {

    setCurrentNodeFunc = (d) => {
        this.props.dispatch(setCurrentNode(d));
    };

    expandNodeFromData = (d) => {
        this.props.dispatch(addToGraphFromId(this.props.graph, d.id));
    };

    componentDidMount() {
        const { data, graph, width, height, allowKeycodes, displayMinimap } = this.props;
        // this.props.dispatch(initializeCanvas(this.props.graph, this.props.width, this.props.height));
        graph.generateCanvas(width ? width : windowWidth, height ? height: windowHeight, this.refs.graphContainer, allowKeycodes);
        if (data.nodes.length !== 0) {
            console.log("updating graph when there are already nodes there", data);
            graph.setData(0, this.makeDeepCopy(data.nodes), this.makeDeepCopy(data.links));
        } else {
            graph.setData(0, [], []);
        }
        graph.bindDisplayFunctions({
            expand: this.expandNodeFromData,
            node: this.setCurrentNodeFunc,
            save: null
        });

      if (displayMinimap === false) { graph.hideMinimap(); }
    }

    componentWillReceiveProps(nextprops) {
        const { data, graph } = this.props;
        graph.bindDisplayFunctions({
            expand: this.expandNodeFromData,
            node: this.setCurrentNodeFunc,
            save: null
        });
    }

    makeDeepCopy(array) {
        let newArray = [];
        array.map((object) => {
            return newArray.push(Object.assign({}, object));
        });
        return newArray;
    }

    render() {
        const { height, width, onMouseOver } = this.props;
        return (
            <div>
                <div ref="graphContainer" style={{"height": height ? height : windowHeight + "px", "width": width ? width : windowWidth + "px"}} onMouseOver={onMouseOver}></div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(graphActions, dispatch),
        dispatch: dispatch
    };
}

export default withRouter(connect(mapDispatchToProps)(Graph));
