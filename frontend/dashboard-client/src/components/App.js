import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import './App.css';
import SaveLinks from './saveLinks';
class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <SaveLinks />
      </div>
    );
  }
}

export default App;
