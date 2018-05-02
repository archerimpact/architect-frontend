import React, { Component } from 'react';

import Graph from './Graph';
import ArcherGraph from './Graph/components/GraphPackage';
import GraphSidebar from './GraphSidebar';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.graph = new ArcherGraph();
  }

  render() {
    return (
      <div className="canvas">
        <Graph graph={this.graph} />
        <GraphSidebar graph={this.graph} />
      </div>
    )
  }
}

export default Canvas;