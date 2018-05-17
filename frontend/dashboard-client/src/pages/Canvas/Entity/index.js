import React, { Component } from 'react';

import './style.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import { withRouter } from 'react-router-dom';
import EntityCard from '../EntityCard';
const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};
const json = JSON.parse(`{"nodes": [{"name":"FAWAZ, Mustapha Reda (maiden name: Darwish)","totalLinks":"21","dateOfBirth":[" 1964-06-25"," 1964-09-10"],"linkTypes":{"HAS_ID_DOC":"5","OWNED_BY":"3","HAS_KNOWN_LOCATION":"2","SANCTIONED_ON":"1","AKA":"9","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452","dataset":"OFAC SDN List","type":"person","placeOfBirth":["Jwaya, Lebanon","Koidu Town, Sierra Leone"]},{"name":"FAWAZ, Moustapha","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Moustapha","dataset":"OFAC SDN List","type":"person"},{"name":"FAWAZ, Mustapha Rhoda Darwich","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rhoda Darwich","dataset":"OFAC SDN List","type":"person"},{"name":"FAWAZ, Mustapha","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha","dataset":"OFAC SDN List","type":"person"},{"name":"Amigo Supermarket Limited","totalLinks":"5","linkTypes":{"OWNED_BY":"2","HAS_KNOWN_LOCATION":"1","SANCTIONED_ON":"1","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17768","dataset":"OFAC SDN List","type":"organization"},{"number":"RL 2101602","totalLinks":"1","issuedIn":"None","linkTypes":{"HAS_ID_DOC":"1"},"numberType":"Passport","id":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 2101602","valid":true,"dataset":"OFAC SDN List","type":"identifyingDocument","issuedBy":"Lebanon"},{"number":"0257909","totalLinks":"1","issuedIn":"None","linkTypes":{"HAS_ID_DOC":"1"},"numberType":"Passport","id":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0257909","valid":true,"dataset":"OFAC SDN List","type":"identifyingDocument","issuedBy":"Sierra Leone"},{"name":"FAWAZ, Mustafa Darwish","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa Darwish","dataset":"OFAC SDN List","type":"person"},{"name":"FAWAZ, Mostafa Reda Darwich","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mostafa Reda Darwich","dataset":"OFAC SDN List","type":"person"},{"name":"HIZBALLAH","totalLinks":"44","linkTypes":{"SIGNIFICANT_PART_OF":"3","PROVIDING_SUPPORT_TO":"11","SANCTIONED_ON":"1","AKA":"22","ACTING_FOR":"7"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697","dataset":"OFAC SDN List","type":"organization"},{"name":"Wonderland Amusement Park and Resort Ltd","totalLinks":"5","linkTypes":{"OWNED_BY":"2","HAS_KNOWN_LOCATION":"1","SANCTIONED_ON":"1","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17769","dataset":"OFAC SDN List","type":"organization"},{"name":"DARWISH-FAWAZ, Moustafa Reda","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/DARWISH-FAWAZ, Moustafa Reda","dataset":"OFAC SDN List","type":"person"},{"number":"0168459","totalLinks":"1","issuedIn":"None","linkTypes":{"HAS_ID_DOC":"1"},"numberType":"Passport","id":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0168459","valid":true,"dataset":"OFAC SDN List","type":"identifyingDocument","issuedBy":"Sierra Leone"},{"city":"Kano","totalLinks":"1","country":"Nigeria","linkTypes":{"HAS_KNOWN_LOCATION":"1"},"line1":"3 Gaya Road","id":"gs://archer-source-data/usa/ofac/sdn.json/3 Gaya Road,,,Kano,,,Nigeria","dataset":"OFAC SDN List","type":"address","combined":"3 Gaya Road,,,Kano,,,Nigeria"},{"name":"FAWWAZ, Mustafa","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWWAZ, Mustafa","dataset":"OFAC SDN List","type":"person"},{"name":"FAWAZ, Mustafa","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa","dataset":"OFAC SDN List","type":"person"},{"name":"Kafak Enterprises Limited","totalLinks":"5","linkTypes":{"OWNED_BY":"2","HAS_KNOWN_LOCATION":"2","SANCTIONED_ON":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17770","dataset":"OFAC SDN List","type":"organization"},{"name":"FAWAZ, Mustapha Rida Darwich","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rida Darwich","dataset":"OFAC SDN List","type":"person"},{"totalLinks":"6","description":"Executive Order 13224 (Terrorism)","linkTypes":{"SANCTIONED_ON":"6"},"id":"gs://archer-source-data/usa/ofac/sdn.json/2015-02-26/Executive Order 13224 (Terrorism)","date":"2015-02-26","dataset":"OFAC SDN List","type":"event","group":"SDGT"},{"number":"RL 0148105","totalLinks":"1","issuedIn":"None","linkTypes":{"HAS_ID_DOC":"1"},"numberType":"Passport","id":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 0148105","valid":true,"dataset":"OFAC SDN List","type":"identifyingDocument","issuedBy":"Lebanon"},{"number":"418-15-2837","totalLinks":"1","issuedIn":"None","linkTypes":{"HAS_ID_DOC":"1"},"numberType":"SSN","id":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/418-15-2837","valid":true,"dataset":"OFAC SDN List","type":"identifyingDocument","issuedBy":"United States"},{"city":"Abuja","totalLinks":"1","country":"Nigeria","linkTypes":{"HAS_KNOWN_LOCATION":"1"},"line1":"Flat 4, Blantyre Street","id":"gs://archer-source-data/usa/ofac/sdn.json/Flat 4, Blantyre Street,Behind Amigo Supermarket,Wuse II,Abuja,,,Nigeria","line2":"Behind Amigo Supermarket","dataset":"OFAC SDN List","type":"address","combined":"Flat 4, Blantyre Street,Behind Amigo Supermarket,Wuse II,Abuja,,,Nigeria","line3":"Wuse II"}], "links": [{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"OWNED_BY","target":"gs://archer-source-data/usa/ofac/sdn.json/16452","source":"gs://archer-source-data/usa/ofac/sdn.json/17768","id":"gs://archer-source-data/usa/ofac/sdn.json/17768OWNED_BYgs://archer-source-data/usa/ofac/sdn.json/16452"},{"type":"OWNED_BY","target":"gs://archer-source-data/usa/ofac/sdn.json/16452","source":"gs://archer-source-data/usa/ofac/sdn.json/17770","id":"gs://archer-source-data/usa/ofac/sdn.json/17770OWNED_BYgs://archer-source-data/usa/ofac/sdn.json/16452"},{"type":"OWNED_BY","target":"gs://archer-source-data/usa/ofac/sdn.json/16452","source":"gs://archer-source-data/usa/ofac/sdn.json/17769","id":"gs://archer-source-data/usa/ofac/sdn.json/17769OWNED_BYgs://archer-source-data/usa/ofac/sdn.json/16452"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Moustapha","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Moustapha"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rida Darwich","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rida Darwich"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mostafa Reda Darwich","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mostafa Reda Darwich"},{"type":"SANCTIONED_ON","target":"gs://archer-source-data/usa/ofac/sdn.json/2015-02-26/Executive Order 13224 (Terrorism)","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452SANCTIONED_ONgs://archer-source-data/usa/ofac/sdn.json/2015-02-26/Executive Order 13224 (Terrorism)"},{"type":"HAS_KNOWN_LOCATION","target":"gs://archer-source-data/usa/ofac/sdn.json/Flat 4, Blantyre Street,Behind Amigo Supermarket,Wuse II,Abuja,,,Nigeria","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_KNOWN_LOCATIONgs://archer-source-data/usa/ofac/sdn.json/Flat 4, Blantyre Street,Behind Amigo Supermarket,Wuse II,Abuja,,,Nigeria"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa Darwish","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustafa Darwish"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rhoda Darwich","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha Rhoda Darwich"},{"type":"HAS_ID_DOC","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0168459","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_ID_DOCgs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0168459"},{"type":"HAS_ID_DOC","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0257909","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_ID_DOCgs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/0257909"},{"type":"HAS_ID_DOC","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 2101602","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_ID_DOCgs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 2101602"},{"type":"HAS_ID_DOC","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 0148105","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_ID_DOCgs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/RL 0148105"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/DARWISH-FAWAZ, Moustafa Reda","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/DARWISH-FAWAZ, Moustafa Reda"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWAZ, Mustapha"},{"type":"HAS_ID_DOC","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/418-15-2837","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_ID_DOCgs://archer-source-data/usa/ofac/sdn.json/16452/idDoc/418-15-2837"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWWAZ, Mustafa","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452AKAgs://archer-source-data/usa/ofac/sdn.json/16452/aka/FAWWAZ, Mustafa"},{"type":"HAS_KNOWN_LOCATION","target":"gs://archer-source-data/usa/ofac/sdn.json/3 Gaya Road,,,Kano,,,Nigeria","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452HAS_KNOWN_LOCATIONgs://archer-source-data/usa/ofac/sdn.json/3 Gaya Road,,,Kano,,,Nigeria"}]}`);

class Entity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nodeData: null,
      relationshipData: null,
      graphData: null
    };
    this.renderEntity = this.renderEntity.bind(this);
  }

  renderEntity(node, nodes, links, keys) {
    const nodeMap = {};

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
      <div>
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
          {keys.map(k => {
            const val = node[k[0]];
            if (node[k[0]]) {
              return (
                <div className="info-row" key={k}>
                  <p className="info-key">{k[1]}:</p>
                  {(!(val instanceof Array))
                    ? <p className="info-value">{val}</p>
                    : <p>list</p>
                  }
                </div>
              )
            }
          })}
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
    if (this.state.nodeData == null || this.state.relationshipData == null) {
      return (
        <div className="entity-container">
          {this.renderEntity(json.nodes.filter(n => n.id === "gs://archer-source-data/usa/ofac/sdn.json/16452")[0], json.nodes, json.links, keys)}
        </div>
      );
    } else {
      return (
        <div>
          {/* <EntityCard nodeItem={this.state.nodeData[0]} /> */}
        </div>
      );
    }
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
