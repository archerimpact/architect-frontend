import React, { Component } from 'react';

import {Switch } from 'react-router-dom';
import PrivateRoute from '../../App/PrivateRoute';
import Entity from './Entity';
import Search from './Search';
import Graph from './Graph';
import ArcherGraph from './Graph/components/GraphPackage';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new ArcherGraph();
  }

  render() {
    return( 
        <div className="full" style={{"height": "100%"}}>
            <Graph graph={this.graph}/>
                <PrivateRoute path="/canvas/search" component={() => {return (<Search graph={this.graph}/>)}}/>

        </div>
    )}
}

export default Canvas;