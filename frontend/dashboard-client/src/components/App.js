import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
class App extends Component {
  render() {
    return (
        <div className="App">
          <div className="App-header">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}><h1>Breadthyme</h1></Link>
          </div>
        </div>
    );
  }
}
 
export default App;
