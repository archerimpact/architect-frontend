import React, {Component} from 'react';

import './style.css'

class SearchBar extends Component {

  constructor() {
    super();
    this.state = {
      settingsExpanded: false
    };
  }

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
  }

  toggleSettings = (e) => {
    e.preventDefault();
    const current = this.state.settingsExpanded;
    this.setState({settingsExpanded: !current});
  }

  getDataSources = () => {
    /* TODO can later be replaced with an actual call to the server to get the datasets */
    return ['All datasets', 'OFAC sanctions', 'OpenCorporate records', 'UK Corporate Registry records'];
  }

  getEntityTypes = () => {
    return ['All types', 'Individual', 'Organization', 'Vessel', 'Aircraft'];
  }

  render() {
    return (
      <div>
        <div className="search-input-container">
          <div className="d-flex flex-row full-height">
            { !this.props.showSettings ?
              null :
              <i id="sort-icon" className="searchbar-icon material-icons" onClick={(e) => {
                this.toggleSettings(e)
              }}>sort</i>
            }
            <form className="search-form" onSubmit={(e) => this.submitSearch(e)}>
              <input className="search-input"
                     ref="query"
                     type="text"
                     placeholder="Search our connected data"
              />
            </form>
            <i id="search-icon" className="searchbar-icon mr-auto material-icons" onClick={(e) => this.submitSearch(e)}>search</i>
          </div>
        </div>
        <div className={this.state.settingsExpanded ? "settings-expanded" : "settings-collapsed"}>
          <div className="filter-controls flex-row d-flex">
            <select className="form-control filter-select sexy-select" id="data-source-select">
              { this.getDataSources().map(s =>
                <option value={s} key={s}>{s}</option>
              ) }
            </select>

            <select className="form-control filter-select sexy-select" id="entity-type-select">
              { this.getEntityTypes().map(e =>
                <option value={e} key={e}>{e}</option>
              ) }
            </select>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchBar;
