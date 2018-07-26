import React, {Component} from "react";

import "./style.css";

class SearchBar extends Component {

    componentDidMount() {
        this.refs.query.value = this.props.value ? this.props.value : null;
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.value !== nextprops.value) {
            this.refs.query.value = nextprops.value;
        }
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.onSubmit(this.refs.query.value);
    };

    render() {
        return (
            <div className="search-container">
                <div id={this.props.homeSearchContainerId} className={this.props.isHomePage ? "home-input-container"  : "search-input-container"}>
                    <div className="d-flex flex-row full-height">
                        <form className="search-form" onSubmit={(e) => this.submitSearch(e)}>
                            <input id={this.props.homeSearchInputId}
                                   className="search-input"
                                   ref="query"
                                   type="text"
                                   placeholder={this.props.placeholder}
                            />
                        </form>
                        <i id="search-icon" className="searchbar-icon mr-auto material-icons"
                           onClick={(e) => this.submitSearch(e)}>search</i>
                    </div>
                </div>
            </div>
        );
    }
}
export default SearchBar;
