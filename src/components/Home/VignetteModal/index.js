import React, {Component} from "react";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/';
import * as homeActions from '../../../redux/actions/homeActions';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import GraphPreview from '../GraphPreview';

import { Link } from "react-router-dom";

import './style.css'

class VignetteModal extends Component {


    constructor(props) {
      super(props);
      this.graph = new ArcherGraph();
    }

    onEntityClick = (string) => {
      // this.graph.flushData();
      var graph = this.graph;
      server.searchBackendText(string)
        .then((data) => {
          let neo4j_id = data[0].id
          this.props.dispatch(homeActions.addToVignetteFromId(graph, neo4j_id, this.props.index));
        })
        .catch((err)=> {console.log(err)})
    };

    render() {
        return (
          <div onClick={this.props.handleClick}>
            <ModalContainer onClose={this.props.handleClose}>
              <ModalDialog onClose={this.props.handleClose}>
                <div className="vignette-card">
              <div className="vignette-card-row flex-row">
                <div className="vignette-card-col vignette-card-left-col">
                  <div className="vignette-card-header">
                    <p className="vignette-date">July 12, 2018</p>
                    <h4 className="vignette-title">How sanctions data applies to human rights</h4>
                    {/*<p className="vignette-author">by Archer Team</p>  */}
                    <hr className="vignette-divider" />
                  </div>

                  <div className="vignette-card-left-col-body">
                    <p className="vignette-content">
                      Click on the highlighted entities in this text to expand the nodes on the graph!
                    </p>
                    <p className="vignette-content">
                      Sanctions data often reveals information and connections about prominent alleged human rights violators.                     </p>
                    <p className="vignette-content">
                      One example is <button onClick={() => {this.onEntityClick("Dan Gertler")}}>Dan Gertler</button>, sanctioned under the Global Magnitsky Executive Order of December 2017. For context, a <a href="https://home.treasury.gov/news/press-releases/sm0417">US Treasury press release</a> states that “Gertler is an international businessman and billionaire who has amassed his fortune through hundreds of millions of dollars’ worth of opaque and corrupt mining and oil deals in the Democratic Republic of the Congo (DRC).”                    </p>
                    <p className="vignette-content">
                      On the graph, you can see Gertler’s companies and associates that appear in the US Treasury SDN list. One company, <button onClick={() => {this.onEntityClick("Fleurette Properties Limited")}}>Fleurette Holdings Limited</button>, is a holding company the owns 20 other companies on the list.
                    </p>
                    <p className="vignette-content">
                      You can also see Gertler’s associate, <button onClick={() => {this.onEntityClick("Pieter Albert Debouitte")}}>Pieter Albert Debouitte</button>, who is connected to <button onClick={() => {this.onEntityClick("Fleurette Properties Limited")}}>Fleurette Holdings Limited</button> and the <button onClick={() => {this.onEntityClick("Gertler Family Foundation")}}>Gertler Family Foundation</button>.
                    </p>
                  </div>
                </div>

                <div className="vignette-card-col vignette-card-right-col">
                    <GraphPreview index={this.props.index} graph={this.graph} startingNode={"Dan Gertler"} />
                </div>
              </div>
            </div>
              </ModalDialog>
            </ModalContainer>
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
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VignetteModal));
