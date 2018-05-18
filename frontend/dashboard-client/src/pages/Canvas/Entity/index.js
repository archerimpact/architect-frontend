import React, { Component } from 'react';

import './style.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import { withRouter } from 'react-router-dom';
import EntityCard from '../EntityCard';
import EntityAttributes from '../EntityAttributes';
import * as server from '../../../server';


const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};

class Entity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentEntity: null,
    };
    this.renderEntity = this.renderEntity.bind(this);
  }

  componentWillMount() {
    server.getNode(decodeURIComponent(this.props.id), false)
      .then(d => {
        this.setState({ currentEntity: d })
      })
      .catch(err => console.log(err));
  }


  renderEntity(node, nodes, links, keys) {
    const nodeMap = {};
    if (node == null) {
      return null
    }
    nodes.map(n => nodeMap[n.id] = n.name)
    const aliases = links.filter(link => link.type === 'AKA' && (node.id === link.source || node.id === link.target));
    const maybe_sames = links.filter(link => link.type === link.type.startsWith('POSSIBLY_SAME_') && node.id === link.source);
    const docs = links.filter(link => link.type === 'HAS_ID_DOC' && (node.id === link.source || node.id === link.target));
    const locs = links.filter(link => link.type === 'HAS_KNOWN_LOCATION' && (node.id === link.source || node.id === link.target));
    const sancs = links.filter(link => link.type === 'SANCTIONED_ON' && (node.id === link.source || node.id === link.target));

    const sig = links.filter(link => link.type === 'SIGNIFICANT_PART_OF' && (node.id === link.source || node.id === link.target));
    const prov = links.filter(link => link.type === 'PROVIDING_SUPPORT_TO' && (node.id === link.source || node.id === link.target));
    const owned = links.filter(link => link.type === 'OWNED_BY' && (node.id === link.source || node.id === link.target));
    const act = links.filter(link => link.type === 'ACTING_FOR' && (node.id === link.source || node.id === link.target));
    // const others = links.filter(link => Object.keys(otherLinks).includes(link.type) && node.id === link.source);


    return (
      <div className="full-width">
        <div className="entity-header-wrapper">
          <div className="entity-header">
            <div className="entity-name">{node.name}</div>
            <div className="entity-type">({node.type})</div>
          </div>
          <div className="entity-source">{node.dataset}</div>
        </div>
        <hr />
        <div className="entity-body">
          <h5 className="">Attributes</h5>
          <EntityAttributes node={node} poo="hi"/>

          {aliases.length ? <h5 className="subheader">Aliases</h5> : null}
          {aliases.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/> )}

          {docs.length ? <h5 className="subheader">Documents</h5> : null}
          {docs.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/> )}

          {locs.length ? <h5 className="subheader">Locations</h5> : null}
          {locs.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/> )}

          {sancs.length ? <h5 className="subheader">Sanction Events</h5> : null}
          {sancs.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/> )}

          {maybe_sames.length ? <h5 className="subheader">Possibly Same As</h5> : null}
          {maybe_sames.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/> )}

          {sig.length ? <h5 className="subheader">Significant Part Of</h5> : null}
          {sig.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/>)}

          {prov.length ? <h5 className="subheader">Providing Support To</h5> : null}
          {prov.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/>)}

          {owned.length ? <h5 className="subheader">Owned By</h5> : null}
          {owned.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/>)}

          {act.length ? <h5 className="subheader">Acting For</h5> : null}
          {act.map(a => <EntityCard data={a} id={a.target} shouldFetch graph={this.props.graph}/>)}
        </div>
      </div>
    )
  }

  render() {
    const keys = [
      ['registered_in', 'Registered In'],
      ['birthdate', 'Date of Birth'],
      ['gender', 'Gender'],
      ['place_of_birth', 'Place of Birth'],
      ['last_seen', 'Last Seen'],
      ['incorporation_date', 'Incorporation Date']
    ];
    if (this.state.currentEntity == null) {
      return <div className="sidebar-content-container"> Click a node to view information about it </div>
    }
    let id = decodeURIComponent(this.props.match.params.query);
    return (
      <div className="sidebar-content-container">
        {this.renderEntity(this.state.currentEntity.nodes.filter(n => n.id === id)[0], this.state.currentEntity.nodes, this.state.currentEntity.links, keys)}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch: dispatch,
  };
}

function mapStateToProps(state, props) {
  return {
    currentNode: state.data.currentNode,
    currentEntity: state.data.currentEntity
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
