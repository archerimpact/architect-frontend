import React, { Component } from 'react';

import './style.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import { withRouter } from 'react-router-dom';
import EntityCard from '../EntityCard';
import EntityAttributes from '../EntityAttributes';

const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};

class Entity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeData: null,
      relationshipData: null,
      graphData: null,
    };
    this.renderEntity = this.renderEntity.bind(this);
  }

  renderEntity(node, nodes, links, keys) {
    const nodeMap = {};
    if (node == null) {
      return null
    }
    nodes.map(n => nodeMap[n.id] = n.name)
    const aliases = links.filter(link => link.type === 'AKA' && (node.id === link.source || node.id === link.target));
    const documents = links.filter(link => link.type === 'HAS_ID_DOC' && node.id === link.source);
    const maybe_sames = links.filter(link => link.type === 'POSSIBLY_SAME_AS' && node.id === link.source);
    const definitely_sames = links.filter(link => link.type.startsWith('HAS_'));

    const otherLinks = {
      'SIGNIFICANT_PART_OF': 'Significant part of',
      'PROVIDING_SUPPORT_TO': 'Providing support to',
      'OWNED_BY': 'Owned by',
      'ACTING_FOR': 'Acting for'
    };
    const others = links.filter(link => Object.keys(otherLinks).includes(link.type) && node.id === link.source);

    return (
      <div className="full-width">
        <div className="entity-header-wrapper">
          <div className="entity-header">
            <div className="entity-name">{node.name}</div>
            <div className="entity-type">({node.type})</div>
          </div>
          <div className="entity-source">OFAC Sanctions Data</div>
        </div>
        <hr />
        <div className="entity-body">
          <h5 className="">Attributes</h5>
          <EntityAttributes node={node} />

          {aliases.length ? <h5>Aliases</h5> : null}
          {aliases.map(a => <EntityCard data={a} id={a.id} shouldFetch graph={this.props.graph}/> )}

          {documents.length ? <h5>Documents</h5> : null}
          {documents.map(a => <EntityCard data={a} id={a.id} shouldFetch graph={this.props.graph}/> )}

          {maybe_sames.length ? <h5>Possibly Same As</h5> : null}
          {maybe_sames.map(a => <EntityCard data={a} id={a.id} shouldFetch graph={this.props.graph}/> )}

          {others.length ? <h5>Associations</h5> : null}
          {others.map(a => <EntityCard data={a} id={a.id} shouldFetch graph={this.props.graph}/>)}
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
    if (this.props.currentEntity == null) {
      return null
    }
    let id = decodeURIComponent(this.props.match.params.query);
<<<<<<< HEAD

=======
>>>>>>> d021822af4dc08e0c5f83face02b57e7c9a13776
    return (
      <div className="sidebar-content-container">
        {this.renderEntity(this.props.currentEntity.nodes.filter(n => n.id === id)[0], this.props.currentEntity.nodes, this.props.currentEntity.links, keys)}
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
