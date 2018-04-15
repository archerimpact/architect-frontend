import React, { Component } from 'react';

import {Switch } from 'react-router-dom';
import PrivateRoute from '../../App/PrivateRoute';
import Entity from '../Entity/';
import Search from '../Search';
import Graph from '../../components/Graph'
import ArcherGraph from '../../components/Graph/components/GraphPackage';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new ArcherGraph();
  }

  render() {
    return( 
        <div>
            <Graph graph={this.graph}/>
            <Switch>
                <PrivateRoute path="/canvas/search" component={() => {return (<Search graph={this.graph}/>)}}/>
                <PrivateRoute path="/canvas/entity/:neo4j_id" component={Entity} />
            </Switch>
        </div>
    )}
}

export default Canvas;