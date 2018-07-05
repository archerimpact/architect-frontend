import React, {Component} from "react";
import Graph from '../../Canvas/Graph/'
import ArcherGraph from "../../Canvas/Graph/package/GraphClass";
import * as server from '../../../server/'
import * as graphActions from '../../../redux/actions/graphActions'
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

import { Link } from "react-router-dom";

import './style.css'

class Vignette extends Component {

    constructor(props) {
      super(props);
      this.graph = new ArcherGraph();

    }

    componentDidMount() {
      this.graph.flushData();
      server.searchBackendText("Ma Xiaohong")
        .then((data) => {
          let neo4j_id = data.hits.hits[0]._id
          this.props.dispatch(graphActions.addToGraphFromId(this.graph, neo4j_id));
        })
        .catch((err)=> {console.log(err)});
    }

    onEntityClick = (string) => {
      // this.graph.flushData();
      var graph = this.graph;
      server.searchBackendText(string)
        .then((data) => {
          let neo4j_id = data.hits.hits[0]._id
          this.props.dispatch(graphActions.addToGraphFromId(graph, neo4j_id));
        })
        .catch((err)=> {console.log(err)})
    }

    render() {
        return (
            <div className='vignette-container' style={{height: '100%'}}>
              <div className='box-left'>
                <div className='vignette-title'>
                  <div className="vignette-title-type">OFAC PRESS RELEASES</div>
                  <h1 className="vignette-header">How to evade sanctions</h1>
                  <p className="vignette-subheader">By the Archer Team</p>
                </div>
                <div className='vignette-text'>
                  <div>
                    A search for “North Korea” on the SanctionsExplorer website returns 411 results.  On the OFAC website, the same search reveals only two listings (an exact name match). Even searching for the four most obvious North Korean sanctions programs together (DPRK, DPRK2, DPRK3, DPRK4) only give 355 entitities total.

                    <br/>Why the discrepancy? Key individuals like <button onClick={() => {this.onEntityClick("Ma Xiaohong")}}>Ma Xiaohong </button> were designated under the NPWMD program (with nationals of all countries) instead of a country-specific program. As a result, SanctionExplorer’s 411 results captures a fuller picture of the North Korean sanctions programs, identifying an additional 28 individuals and 28 entities.

                    <br/>Exploring our 411 results provides additional insights. Drilling down using the “Related to Country” field (a unique SanctionsExplorer filter that combines address, location, nationality, document issuer, and more) and searching for “China,” we get 71 results. This fuller picture includes entities like the <button onClick={() => {this.onEntityClick("Hana Banking Corp")}}>Hana Banking Corp</button> (a North Korean bank with branches in both North Korea and China), and <button onClick={() => {this.onEntityClick("Chong-nam Yo'n")}}>Chong-Nam Yo’n </button> (<button onClick={() => {this.onEntityClick("KOREA MINING DEVELOPMENT TRADING CORPORATION")}}>KOMID’s</button> Chief Representative, a North Korean national who is located in Dalian, China).

                    <br/>Finally, using our unique “Dates” filter, we can easily compare the number of sanctions designations over time. Searching “2002-2015,” 
                    we see a total of 90 designations over the 13 year period. This is
                    a striking contrast to “2018”, which — just three months into
                    the year —  has already reached 87 listings, pointing to 
                    growing fears over North Korea’s rapidly expanding
                    nuclear capability. 
                  </div>

                {/*
                  <div>
                    UNITED NATIONS, March 6 (Reuters) - The U.N. Security Council is set to blacklist two North Korean enterprises and three individuals working for North Korean entities involved in arms trade and Pyongyang’s missile program, according to a draft resolution.
                    <br />
                    The three individuals to be blacklisted include <button onClick={() => {this.onEntityClick("Yon Chong Nam")}}>Yon Chong Nam</button>, chief representative of the <button onClick={() => {this.onEntityClick("Korea Mining Development Trading Corporation")}}>Korea Mining Development Trading Corporation (KOMID)</button>, which has been under U.N. sanctions since 2009.

                    <br />
                    KOMID is North Korea’s primary arms dealer and main exporter of goods and equipment related to ballistic missiles and conventional weapons, the draft says.

                    <br />
                    Yon’s deputy at KOMID, <button onClick={() => {this.onEntityClick("Ko Chol Chae")}}> Ko Chol Chae </button>, is also to be blacklisted, along with <button onClick={() => {this.onEntityClick("Mun Chong Chol")}}>Mun Chong Chol</button>, an official at <button onClick={() => {this.onEntityClick("Tanchon Commercial Bank")}}>Tanchon Commercial Bank</button>. Tanchon was added to the U.N. blacklist in 2009 as the main North Korean financier for sales of conventional weapons and ballistic missiles, and goods related to assembly and manufacture of conventional arms and missiles.

                    <br />
                    The North Korean entities to be blacklisted include the <button onClick={() => {this.onEntityClick("Second Academy of Natural Sciences")}}>Second Academy of Natural Sciences</button>, which the draft says is “a national-level organization responsible for research and development of the DPRK’s advanced weapons systems, including missiles and probably nuclear weapons.”

                    <br />
                    The other is <button onClick={() => {this.onEntityClick("Korea Complex Equipment Import Corporation")}}>Korea Complex Equipment Import Corporation</button>, a subsidiary of <button onClick={() => {this.onEntityClick("Korea Ryonbong General Corporation")}}>Korea Ryonbong General Corporation</button>.

                    <br />
                    Korea Ryonbong was blacklisted in April 2009. The draft resolution says it is “a defense conglomerate specializing in acquisition for DPRK defense industries and support to ... military-related sales.”
                  </div>*/}

                  {/*<div>
<button onClick={() => {this.onEntityClick("FELIX RAMON BAUTISTA ROSARIO")}}>FELIX RAMON BAUTISTA ROSARIO</button>
<br/>Bautista is a Senator from the Dominican Republic who has engaged in significant acts of corruption in both the Dominican Republic and Haiti, and who has been publicly accused of money laundering and embezzlement. Bautista has reportedly engaged in bribery in relation to his position as a Senator, and is alleged to have engaged in corruption in Haiti, where he used his connections to win public works contracts to help rebuild Haiti following several natural disasters, including one case where his company was paid over $10 million for work it had not completed.

<br/>
In a related action, OFAC designated five entities in the Dominican Republic that are owned or controlled by Bautista: <button onClick={() => {this.onEntityClick("Constructora Hadom SA")}}>Constructora Hadom SA</button>, <button onClick={() => {this.onEntityClick("Soluciones Electricas Y Mecanicas Hadom S.R.L.")}}>Soluciones Electricas Y Mecanicas Hadom S.R.L.</button>, <button onClick={() => {this.onEntityClick("Seymeh Ingenieria SRL")}}>Seymeh Ingenieria SRL</button>, <button onClick={() => {this.onEntityClick("Inmobiliaria Rofi SA")}}>Inmobiliaria Rofi SA</button>, and <button onClick={() => {this.onEntityClick("Constructora Rofi SA")}}>Constructora Rofi SA</button>.

<br/><button onClick={() => {this.onEntityClick("HING BUN HIENG")}}>HING BUN HIENG</button>
<br/>Bun Hieng is the commander of Cambodia’s Prime Minister Bodyguard Unit (PMBU), a unit in the Royal Cambodian Armed Forces that has engaged in serious acts of human rights abuse against the people of Cambodia. The PMBU has been implicated in multiple attacks on unarmed Cambodians over the span of many years, including in 2013 at Wat Phnom and in 2015 in front of the National Assembly.  In the 2015 incident, only three members of the PMBU were sent to jail after they confessed to participating in an attack on opposition lawmakers, and were promoted upon their release.  Bun Hieng and the PMBU have been connected to incidents where military force was used to menace gatherings of protesters and the political opposition going back at least to 1997, including an incident where a U.S. citizen received shrapnel wounds.

<br/>As a result of these actions, any property, or interest in property, of those designated today within U.S. jurisdiction is blocked. Additionally, U.S. persons are generally prohibited from engaging in transactions with blocked persons, including entities 50 percent or more owned by designated persons.


                  </div>*/}
                </div>
              </div>
              <div className='box-right'>
                <Graph graph={this.graph} height={480} width={600} displayMinimap={false} />
              </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Vignette));
