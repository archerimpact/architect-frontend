import React, { Component } from 'react';

import './style.css'

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../../redux/actions/';
import { withRouter } from 'react-router-dom';

const tab_style = {
  backgroundColor: '#FFFFFF',
  color: '#747474'
};
const json = JSON.parse(`{"nodes": [{"name":"AQIL, Ibrahim","totalLinks":"3","linkTypes":{"SIGNIFICANT_PART_OF":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18348","type":"person"},{"name":"TAHINI, Abdallah Asad","totalLinks":"4","linkTypes":{"AKA":"3","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17789","type":"person"},{"name":"LH","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/LH","type":"organization"},{"name":"Hizballah ESO","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah ESO","type":"organization"},{"name":"HAMDAR, Muhammad Ghaleb","totalLinks":"8","linkTypes":{"HAS_ID_DOC":"2","AKA":"5","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/20720","type":"person"},{"name":"AYAD, Yosef","totalLinks":"3","linkTypes":{"ACTING_FOR":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/20721","type":"person"},{"name":"SERHAN, Fadi Hussein","totalLinks":"5","linkTypes":{"OWNED_BY":"1","HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18932","type":"person"},{"name":"External Services Organization","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Services Organization","type":"organization"},{"name":"CHERRI, Adel Mohamad","totalLinks":"5","linkTypes":{"OWNED_BY":"1","HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18930","type":"person"},{"name":"External Security Organization","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization","type":"organization"},{"name":"HIZBALLAH","totalLinks":"43","linkTypes":{"SIGNIFICANT_PART_OF":"3","PROVIDING_SUPPORT_TO":"11","AKA":"22","ACTING_FOR":"7"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697","type":"organization"},{"name":"ISLAMIC JIHAD FOR THE LIBERATION OF PALESTINE","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD FOR THE LIBERATION OF PALESTINE","type":"organization"},{"name":"KALLAS, Muhammad Al-Mukhtar","totalLinks":"5","linkTypes":{"HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"2","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/20562","type":"person"},{"name":"ISLAMIC JIHAD ORGANIZATION","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD ORGANIZATION","type":"organization"},{"name":"Car Care Center","totalLinks":"4","linkTypes":{"PROVIDING_SUPPORT_TO":"1","AKA":"3"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18222","type":"organization"},{"name":"FOLLOWERS OF THE PROPHET MUHAMMED","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/FOLLOWERS OF THE PROPHET MUHAMMED","type":"organization"},{"name":"NOUREDDINE, Mohamad","totalLinks":"4","linkTypes":{"OWNED_BY":"1","HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"1","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/19388","type":"person"},{"name":"BADR AL DIN, Mustafa","totalLinks":"7","linkTypes":{"SIGNIFICANT_PART_OF":"1","AKA":"6"},"id":"gs://archer-source-data/usa/ofac/sdn.json/13423","type":"person"},{"name":"CHARARA, Ali Youssef","totalLinks":"4","linkTypes":{"OWNED_BY":"1","PROVIDING_SUPPORT_TO":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/19274","type":"person"},{"name":"SHALAN, Abd Al Nur","totalLinks":"6","linkTypes":{"AKA":"5","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17160","type":"person"},{"name":"Foreign Action Unit","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Action Unit","type":"organization"},{"name":"ORGANIZATION OF THE OPPRESSED ON EARTH","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF THE OPPRESSED ON EARTH","type":"organization"},{"name":"Lebanese Hezbollah","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hezbollah","type":"organization"},{"name":"TABAJA, Adham Husayn","totalLinks":"11","linkTypes":{"HAS_ID_DOC":"2","OWNED_BY":"3","PROVIDING_SUPPORT_TO":"3","AKA":"2","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18218","type":"person"},{"name":"Special Operations Branch","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Special Operations Branch","type":"organization"},{"name":"FRD","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/FRD","type":"organization"},{"name":"ZAHER EL DINE, Hamdi","totalLinks":"3","linkTypes":{"HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"1","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/19389","type":"person"},{"name":"FA'UR, Husayn Ali","totalLinks":"2","linkTypes":{"AKA":"1","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18223","type":"person"},{"name":"ANSAR ALLAH","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ANSAR ALLAH","type":"organization"},{"name":"ISLAMIC JIHAD","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD","type":"organization"},{"name":"Hizballah International","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah International","type":"organization"},{"name":"ORGANIZATION OF RIGHT AGAINST WRONG","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF RIGHT AGAINST WRONG","type":"organization"},{"name":"PARTY OF GOD","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/PARTY OF GOD","type":"organization"},{"name":"JAMAL-AL-DIN, Hasan","totalLinks":"4","linkTypes":{"HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"2","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/20561","type":"person"},{"name":"External Security Organization of Hezbollah","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization of Hezbollah","type":"organization"},{"name":"ESO","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ESO","type":"organization"},{"name":"Global Cleaners S.A.R.L.","totalLinks":"3","linkTypes":{"OWNED_BY":"1","PROVIDING_SUPPORT_TO":"1","AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/20560","type":"organization"},{"name":"HEJEIJ, Kassem","totalLinks":"4","linkTypes":{"HAS_ID_DOC":"1","PROVIDING_SUPPORT_TO":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18224","type":"person"},{"name":"Lebanese Hizballah","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hizballah","type":"organization"},{"name":"REVOLUTIONARY JUSTICE ORGANIZATION","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/REVOLUTIONARY JUSTICE ORGANIZATION","type":"organization"},{"name":"Foreign Relations Department","totalLinks":"1","linkTypes":{"AKA":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Relations Department","type":"organization"},{"name":"SHUKR, Fu'ad","totalLinks":"3","linkTypes":{"SIGNIFICANT_PART_OF":"1","AKA":"2"},"id":"gs://archer-source-data/usa/ofac/sdn.json/18349","type":"person"},{"name":"FAWAZ, Fouzi Reda Darwish","totalLinks":"12","linkTypes":{"HAS_ID_DOC":"2","OWNED_BY":"3","AKA":"6","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/17771","type":"person"},{"name":"FAWAZ, Mustapha Reda (maiden name: Darwish)","totalLinks":"18","linkTypes":{"HAS_ID_DOC":"5","OWNED_BY":"3","AKA":"9","ACTING_FOR":"1"},"id":"gs://archer-source-data/usa/ofac/sdn.json/16452","type":"person"}], "links": [{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/19388","id":"gs://archer-source-data/usa/ofac/sdn.json/19388PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/19274","id":"gs://archer-source-data/usa/ofac/sdn.json/19274PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18932","id":"gs://archer-source-data/usa/ofac/sdn.json/18932PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18930","id":"gs://archer-source-data/usa/ofac/sdn.json/18930PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"SIGNIFICANT_PART_OF","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18349","id":"gs://archer-source-data/usa/ofac/sdn.json/18349SIGNIFICANT_PART_OFgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"SIGNIFICANT_PART_OF","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18348","id":"gs://archer-source-data/usa/ofac/sdn.json/18348SIGNIFICANT_PART_OFgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18224","id":"gs://archer-source-data/usa/ofac/sdn.json/18224PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18223","id":"gs://archer-source-data/usa/ofac/sdn.json/18223ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/PARTY OF GOD","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/PARTY OF GOD"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/20721","id":"gs://archer-source-data/usa/ofac/sdn.json/20721ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/20720","id":"gs://archer-source-data/usa/ofac/sdn.json/20720ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/20562","id":"gs://archer-source-data/usa/ofac/sdn.json/20562PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/20561","id":"gs://archer-source-data/usa/ofac/sdn.json/20561PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/20560","id":"gs://archer-source-data/usa/ofac/sdn.json/20560PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/19389","id":"gs://archer-source-data/usa/ofac/sdn.json/19389PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/FOLLOWERS OF THE PROPHET MUHAMMED","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/FOLLOWERS OF THE PROPHET MUHAMMED"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hizballah","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hizballah"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF RIGHT AGAINST WRONG","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF RIGHT AGAINST WRONG"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ANSAR ALLAH","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ANSAR ALLAH"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF THE OPPRESSED ON EARTH","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ORGANIZATION OF THE OPPRESSED ON EARTH"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD FOR THE LIBERATION OF PALESTINE","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD FOR THE LIBERATION OF PALESTINE"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD ORGANIZATION","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ISLAMIC JIHAD ORGANIZATION"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/REVOLUTIONARY JUSTICE ORGANIZATION","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/REVOLUTIONARY JUSTICE ORGANIZATION"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Action Unit","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Action Unit"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah ESO","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah ESO"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/ESO","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/ESO"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Relations Department","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Foreign Relations Department"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/FRD","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/FRD"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hezbollah","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Lebanese Hezbollah"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/LH","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/LH"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Special Operations Branch","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Special Operations Branch"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah International","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/Hizballah International"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization of Hezbollah","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Security Organization of Hezbollah"},{"type":"AKA","target":"gs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Services Organization","source":"gs://archer-source-data/usa/ofac/sdn.json/4697","id":"gs://archer-source-data/usa/ofac/sdn.json/4697AKAgs://archer-source-data/usa/ofac/sdn.json/4697/aka/External Services Organization"},{"type":"SIGNIFICANT_PART_OF","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/13423","id":"gs://archer-source-data/usa/ofac/sdn.json/13423SIGNIFICANT_PART_OFgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/16452","id":"gs://archer-source-data/usa/ofac/sdn.json/16452ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/17160","id":"gs://archer-source-data/usa/ofac/sdn.json/17160ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/17771","id":"gs://archer-source-data/usa/ofac/sdn.json/17771ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"ACTING_FOR","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/17789","id":"gs://archer-source-data/usa/ofac/sdn.json/17789ACTING_FORgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18218","id":"gs://archer-source-data/usa/ofac/sdn.json/18218PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"},{"type":"PROVIDING_SUPPORT_TO","target":"gs://archer-source-data/usa/ofac/sdn.json/4697","source":"gs://archer-source-data/usa/ofac/sdn.json/18222","id":"gs://archer-source-data/usa/ofac/sdn.json/18222PROVIDING_SUPPORT_TOgs://archer-source-data/usa/ofac/sdn.json/4697"}]}`);

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
          { keys.map(k => {
              const val = node[k[0]];
              if (node[k[0]]) {
                return (
                  <div className="info-row" key={k}>
                    <p className="info-key">{k[1]}:</p>
                    { (!(val instanceof Array))
                      ? <p className="info-value">{val}</p>
                      : <p>list</p>
                    }
                  </div>
                )
              }
          }) }
          {
            (() => {
              const nodeMap = {};

              nodes.map(n => nodeMap[n.id] = n.name)

              const aliases          = links.filter(link => link.type === 'AKA' && node.id.startsWith(link.source));
              const maybe_sames      = links.filter(link => link.type === 'POSSIBLE_SAME_AS');
              const definitely_sames = links.filter(link => link.type.startsWith('HAS_'));

              const otherLinks = ['SIGNIFICANT_PART_OF', 'PROVIDING_SUPPORT_TO', 'OWNED_BY', 'ACTING_FOR']
              const others = links.filter(link => otherLinks.includes(link.type));

              return (
                <div>
                  {/*
                    Component that accepts a node and an id.  It will choose the source/target appropriately,
                    render an in- or out-going arrow.
                  */}
                  {aliases.length ? <h5>Aliases</h5> : null}
                  {aliases.map(a => <p key={a.id}>{nodeMap[a.target] + ': ' + JSON.stringify(a)}</p>)}

                  {maybe_sames.length ? <h5>Possibly Same As</h5> : null}
                  {maybe_sames.map(a => <p key={a.id}>{JSON.stringify(a)}</p>)}

                  {others.length ? <h5>Associations</h5> : null}
                  {others.map(a => <p key={a.id}>{JSON.stringify(a)}</p>)}
                </div>
              )
              
            })()
          }
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
          {this.renderEntity(json.nodes.filter(n => n.id === "gs://archer-source-data/usa/ofac/sdn.json/4697")[0], json.nodes, json.links, keys)}
        </div>
      );
    } else {
      return (
        <div>
          {/* <EntityCard nodeItem={this.state.nodeData[0]} /> */}
          {/* <hr></hr>
          <SummaryInfo nodeItem={this.state.nodeData[0]} nodeRelationships={this.state.relationshipData} /> */}
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
    currentNode: state.currentNode
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Entity));
