import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NewText from './NewText.js'
import NavBar from './NavBar.js'
import AddEntity from './AddEntity.js'
import EntityBox from './EntityBox.js'
import EntityList from './EntityList.js'



import DocumentDisplay from './DocumentDisplay.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div className="body">  
          <NavBar />
          <div className="centered">
              <NewText />
              <AddEntity className="addentity"/>
          </div>
          <hr></hr>
          <div className="document-entities">
            <div className="left-column">
              <DocumentDisplay />

            </div>

            <div className="right-column">
              <EntityList />
            </div>

          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
