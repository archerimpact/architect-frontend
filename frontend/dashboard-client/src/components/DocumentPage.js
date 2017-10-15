import React, { Component } from 'react';
import './App.css';

import NewText from './NewText.js'
import AddEntity from './AddEntity.js'
import EntityList from './EntityList.js'
import GraphContainer from './GraphContainer.js'

import DocumentDisplay from './DocumentDisplay.js'

class DocumentPage extends Component {

  render() {
    return (
      <div className="body">  
        <div className="centered">
            <NewText />
            <AddEntity className="addentity"/>

        </div>
        <div className="document-entities">
          <div className="left-column">
            <DocumentDisplay />

          </div>

          <div className="middle-column">
            <EntityList />
          </div>

          <div className="right-column">
            <GraphContainer />

          </div>

        </div>
      </div>
    );
  }
}
 
export default DocumentPage;
