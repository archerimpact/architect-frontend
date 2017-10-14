import React, { Component } from 'react';
import './App.css';
import SaveLinks from './saveLinks';

import NewText from './NewText.js'
import NavBar from './NavBar.js'
import AddEntity from './AddEntity.js'
import EntityBox from './EntityBox.js'
import EntityList from './EntityList.js'
import GraphContainer from './GraphContainer.js'

import DocumentDisplay from './DocumentDisplay.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router-dom';

class App extends Component {

  render() {
    return (
        <div>
            <NavBar />

        </div>
    );
  }
}
 
export default App;
