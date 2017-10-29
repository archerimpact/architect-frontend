import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
    render() {
        return (
            <div>
                <p style={{ margin: '20px'}}> Michael Murphy </p>
               <div className="App">
                    <h2>Your Investigation</h2>
                    <Link to="/links" style={{color: 'inherit' }}>View saved links</Link>
                   wow some words
                </div>
            </div>
        );
    }
}
 
export default Home
