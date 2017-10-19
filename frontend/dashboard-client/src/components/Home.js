import React, { Component } from 'react';

import './App.css'

class Home extends Component {
    render() {
        return (
            <div>
                <p style={{ margin: '20px'}}> Michael Murphy </p>
                <div className="App">
                    <h2>Your Investigation</h2>
                    <Link to="/links" style={{color: 'inherit' }}>View saved links</Link>
                    <p></p>
                    <Link to="/projects" style={{color: 'inherit' }}>View projects</Link>
                    <p></p>
                    <Link to="/pdf-uploader" style={{color: 'inherit' }}>Upload a pdf</Link>
                </div>
            </div>
        );
    }
}

export default Home
