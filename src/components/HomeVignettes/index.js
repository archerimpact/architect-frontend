import React, {Component} from "react";
import SearchBarDatabase from "../searchBarDatabase";
import SideNavBar from "../sideNavBar";
import Vignette from './Vignette/';
import ActionSection from './ActionSection';

import "./style.css";

export default class HomeVignettes extends Component {

    render() {
        return (
            <div>
                <SideNavBar/>
                <div className='home-body'>
                    <div className='logo-container'>
                      <img className="logo-center" src="logo.png" />
                    </div>
                    <div className="search-main" style={{height: '100%'}}>
                        <SearchBarDatabase showSettings={false}/>
                    </div>
                    <div className='vignettes'>
                      <Vignette key={1}/>
                      <Vignette key={2}/>
                    </div>
                    <ActionSection />
                </div>
            </div>
        );
    }
}