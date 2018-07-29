import React, { Component } from "react";
import ReactDOM from 'react-dom'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import * as graphActions from "../../../redux/actions/graphActions";
import { saveD3DataToRedux } from "../../../redux/actions/graphActions";
import * as homeActions from '../../../redux/actions/homeActions';

import { fetchCurrentEntity } from "../../../redux/actions/graphSidebarActions"

import "./graph.css";
import "./style.css";

class Graph extends Component {
    constructor(props) {
      super(props);
      this.state = { width: window.innerWidth, height: window.innerHeight };
    }

    fetchCurrentEntityFunc = (d) => {
        if (!this.props.index) {
            this.props.dispatch(fetchCurrentEntity(d));
        }
    };

    expandNodeFromData = (d) => {
        if (this.props.index) {
            this.props.dispatch(homeActions.addToVignetteFromId(this.props.graph, d.id, this.props.index))
        } else {
            this.props.dispatch(graphActions.addToGraphFromId(this.props.graph, d.id));
        }
    };

    saveD3DataToReduxFunc = (data) => {
        this.props.dispatch(saveD3DataToRedux(data.nodes, data.links))
    };

    updateWindowDimensions = () => {
      this.setState({ width: this.refs.graphContainer.parentNode.clientWidth, height: this.refs.graphContainer.parentNode.clientHeight });
    };

    componentDidMount() {
        const { data, graph, allowKeycodes, displayMinimap } = this.props;
        // this.props.dispatch(initializeCanvas(this.props.graph, this.props.width, this.props.height));
        
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        graph.generateCanvas(this.state.width, this.state.height, this.refs.graphContainer, allowKeycodes);
        if (data.nodes.length !== 0) {
            graph.setData(0, this.makeDeepCopy(data.nodes), this.makeDeepCopy(data.links));
        } else {
            graph.setData(0, [], []);
        }
        graph.bindReactActions({
            expand: this.expandNodeFromData,
            node: this.fetchCurrentEntityFunc,
            save: this.saveD3DataToReduxFunc
        });

        if (displayMinimap === false) { graph.hideMinimap(); }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data.id !== nextProps.data.id) {
            nextProps.graph.setData(0, this.makeDeepCopy(nextProps.data.nodes), this.makeDeepCopy(nextProps.data.links));
            if (nextProps.displayMinimap === false) { nextProps.graph.hideMinimap(); }
        }
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    makeDeepCopy(array) {
        let newArray = [];
        array.map((object) => {
            return newArray.push(Object.assign({}, object));
        });
        return newArray;
    }

    render() {
        const { onMouseOver } = this.props;
        return (
            <div 
              id="graph-container" 
              ref="graphContainer"
              style={{"height": this.state.height + "px", "width": this.state.width + "px"}} 
              onMouseOver={onMouseOver}
            />
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
