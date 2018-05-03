import React, { Component } from 'react';

import './style.css'

class SearchBar extends Component {

  constructor() {
    super();
    this.state = {
      settingsExpanded: false
    };
    this.submitSearch = this.submitSearch.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
    this.getDataSources = this.getDataSources.bind(this);
    this.getEntityTypes = this.getEntityTypes.bind(this);
  }

  componentDidMount() {
    this.refs.query.value = this.props.value ? this.props.value : null;
  }
  componentWillReceiveProps(nextprops) {
    if (this.props.value !== nextprops.value) {
      this.refs.query.value = nextprops.value;
    }
  }

  submitSearch(e) {
    e.preventDefault();
    this.props.onSubmit(this.refs.query.value);
  }

  toggleSettings(e) {
    e.preventDefault();
    const current = this.state.settingsExpanded;
    this.setState({settingsExpanded: !current});
  }

  getDataSources() {
    /* TODO can later be replaced with an actual call to the server to get the datasets */
    return ['All datasets', 'OFAC sanctions', 'OpenCorporate records', 'UK Corporate Registry records'];
  }

  getEntityTypes() {
    return ['All types', 'Individual', 'Organization', 'Vessel', 'Aircraft'];
  }

  render (){
    return(
      <div className="searchBody">
        <div className="search-input-container">
          <form className="search-form" onSubmit={(e) => this.submitSearch(e)}>
            <input className="search-input"
              ref="query"
              type="text"
              placeholder="Search our connected data"
            />
          </form>
          <div className="search-button d-flex">
            <i className="search-icon material-icons" onClick={(e) => this.submitSearch(e)}>search</i>
            <i className="search-icon material-icons" onClick={(e) => {this.toggleSettings(e)}}>sort</i>
          </div>
        </div>
        <div className={this.state.settingsExpanded ? "settings-expanded" : "settings-collapsed"}>
          <div className="filter-controls flex-row">
            <select className="form-control filter-select sexy-select" id="data-source-select">
              { this.getDataSources().map(s => 
                <option value={s}>{s}</option>
              ) }
            </select>

            <select className="form-control filter-select sexy-select" id="entity-type-select">
              { this.getEntityTypes().map(e => 
                <option value={e}>{e}</option>
              ) }
            </select>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchBar;
