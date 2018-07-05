import React, {Component} from "react";

import "./style.css";

import {Link, NavLink, withRouter} from "react-router-dom";


class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dropdownShow: 'none',
            visible: true,
        };
    }

    componentDidMount() {
        // let currentPath = this.props.location.pathname;
        // if (this.exploreCanvasPath.test(currentPath) || this.buildCanvasPath.test(currentPath)) {
        // 	this.setState({ visible: false });
        // }
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    // componentWillReceiveProps(nextProps){
    // 	let currentPath = nextProps.location.pathname;
    // 	// if (currentRoutes.pathname === '/explore/:sidebarState?"' || currentRoutes.pathname === '/build/:investigationId') {
    // 	if (this.exploreCanvasPath.test(currentPath) || this.buildCanvasPath.test(currentPath)) {
    // 		this.setState({ visible: false });
    // 	} else {
    // 		this.setState({ visibility: true });
    // 	}
    // }

    handleClickOutside = (event) => {
        let targetClass = event.target.className;
        if (targetClass === 'nav-dropbtn') {
            return this.toggleDropdown();
        } else {
            if (this.state.dropdownShow === 'block' && targetClass !== 'nav-dropdown-content-button' && targetClass !== 'nav-link drop-nav-link') {
                this.setState({dropdownShow: 'none'});
            }
            return true;
        }
    }

    toggleDropdown = () => {
        let newShow = '';
        if (this.state.dropdownShow === 'none') {
            newShow = 'block';
        } else {
            newShow = 'none'
        }
        this.setState({dropdownShow: newShow})
        return true
    }

    render() {
        const authenticated = (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link className="navbar-brand" to="/">
                    <span className="architect">Archer</span>
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav ml-auto">
                        <NavLink className="nav-item" activeClassName="active-right-link" to="/build">
                            <span className="nav-link">Build</span>
                        </NavLink>
                        <NavLink className="nav-item" activeClassName="active-right-link" to="/explore">
                            <span className="nav-link">Explore</span>
                        </NavLink>
                        <NavLink className="nav-item" activeClassName="active-right-link" to="/login">
                            <span className="nav-link" onClick={this.props.logOut}>Log Out</span>
                        </NavLink>
                    </ul>
                </div>
            </nav>
        );

        const unauthenticated = (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <Link className="navbar-brand" to="/">
                    <span className="architect">Archer</span>
                </Link>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarColor02">
                    <ul className="navbar-nav ml-auto">
                        <NavLink className="nav-item" activeClassName="active-right-link" to={{
                            pathname: '/login',
                            state: {from: this.props.location},
                        }}>
                            <span className="nav-link" onClick={this.props.logOut}>Log In</span>
                        </NavLink>
                    </ul>
                </div>
            </nav>
        )

        return (
            this.props.isAuthenticated ? authenticated : unauthenticated
        );
    };
}
;

export default withRouter(NavBar);
