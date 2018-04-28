import React, { Component } from 'react';
import queryString from 'query-string';

import './style.css'

import { Link, withRouter } from 'react-router-dom';
// class EntityCard extends Component {

//   constructor(props) {
//     super(props);
//     this.fetchSearchQuery = this.fetchSearchQuery.bind(this);
//     this.state = {
//       link: this.fetchSearchQuery()
//     }
//   }

//   fetchSearchQuery() {
//     let qs = queryString.parse(this.props.location.search);
//     // let newEntity = this.props.nodeItem.metadata.id;
//     let newEntityid = this.props.nodeItem._source ? this.props.nodeItem._source.neo4j_id : this.props.nodeItem.metadata.id
//     // this.props.history.push('/dresses?color=blue'+'?entity='+entity);
//     let graphid = this.props.newgraphid ? newEntityid : qs.graphid;

//     let newQs = queryString.stringify({search: qs.search, graphid: graphid, entityid: newEntityid})
//     return {
//       pathname: '/explore/entity',
//       search: newQs
//     };
//   }

//   render(){
//     var nodeItem = this.props.nodeItem
//     var type, name, neo4j_id, jurisdiction, date_of_creation, source, company_status, nationality;
//     if (nodeItem._source != null) {
//       neo4j_id = nodeItem._source.neo4j_id;
//       name = nodeItem._source.name;
//       type = nodeItem._type;
//       jurisdiction = nodeItem._source.jurisdiction;
//       date_of_creation = nodeItem._source.date_of_creation;
//       source = nodeItem._source.self;
//       company_status = nodeItem._source.company_status;
//       nationality = nodeItem._source.nationality;

//     } else if (nodeItem.metadata != null) {
//       neo4j_id = nodeItem.metadata.id;
//       name = nodeItem.data.name;
//       type = nodeItem.metadata.labels[0];
//       jurisdiction = nodeItem.data.jurisdiction;
//       date_of_creation = nodeItem.data.date_of_creation;
//       source = nodeItem.self;
//       company_status = nodeItem.data.company_status;
//       nationality = nodeItem.data.nationality;
//     }
//     if (typeof(nodeItem) ==='undefined' || nodeItem === null) {
//       return (
//         <div></div>
//       );
//     }
//     // else if (nodeItem.metadata.labels[0]==='person'){
//       else if (type==='person'){

//       return(    
//         <div className="outerBox">
//           <div className="heading">
//             <div className="titleName underline">
//               <Link to={this.state.link}>{name}</Link>
//             </div>   
//             <i style={{marginRight: '8px'}}>Person</i>
//             <span className="identifyingInfo">
//               <span className="info">[United Kingdom Companies House Business Registry]</span>
//             </span>
//           </div>
//         </div>
//       );
//      } else if (type==='corporation'){

//     // } else if (nodeItem.metadata.labels[0]==='corporation'){
//       return (
//         <div className="outerBox">
//           <div className="heading">
//             <div className="titleName underline" onClick={() => {debugger;this.updateSearchQuery()}}>
//               <Link to={this.state.link}>{name}</Link>
//             </div>
//             <div className="status">
//               {company_status}
//             </div>
//           </div>
//           <i>Company</i>
//           <div className="identifyingInfo">
//             <div>{nationality} </div>
//             <div className="info">{"Jurisdiction: " + jurisdiction}</div>
//             <div className="info">{"Date Created: " + date_of_creation}</div>
//           </div>
//         </div>
//       );
//     } else if (type==='Document'){

//     // } else if (nodeItem.metadata.labels[0]==='Document'){
//       // return (
//       //   <div className="outerBox">
//       //     <div className="titleName">
//       //       Document
//       //     </div>
//       //     <p>{"GCS Self: " + source }</p>
//       //   </div>
//       // );
//     // } else {
//     //   return (
//     //   <p>Data type not supported.</p>
//     //   );
//     // }
//   }
// }


class EntityCard extends Component {

  constructor(props) {
    super(props);
    this.fetchSearchQuery = this.fetchSearchQuery.bind(this);
    var nodeItem = this.props.nodeItem
    this.renderBody = this.renderBody.bind(this);
    debugger
    this.state = {
      link: this.fetchSearchQuery(),
      neo4j_id : nodeItem._source !== null ? nodeItem._source.neo4j_id : nodeItem.metadata.id,
      name : nodeItem._source !== null ? nodeItem._source.name : nodeItem.data.name,
      type : nodeItem._source !== null ? nodeItem._type : nodeItem.metadata.labels[0],
      jurisdiction : nodeItem._source !== null ? nodeItem._source.jurisdiction : nodeItem.data.jurisdiction,
      date_of_creation : nodeItem._source !== null ? nodeItem._source.date_of_creation :nodeItem.data.date_of_creation,
      source : nodeItem._source !== null ? nodeItem._source.self : nodeItem.self,
      company_status : nodeItem._source !== null ? nodeItem._source.company_status : nodeItem.data.company_status,
      nationality : nodeItem._source !== null ? nodeItem._source.nationality : nodeItem.data.nationality,
    }
  }

  fetchSearchQuery() {
    let qs = queryString.parse(this.props.location.search);
    // let newEntity = this.props.nodeItem.metadata.id;
    let newEntityid = this.props.nodeItem._source ? this.props.nodeItem._source.neo4j_id : this.props.nodeItem.metadata.id
    // this.props.history.push('/dresses?color=blue'+'?entity='+entity);
    let graphid = this.props.newgraphid ? newEntityid : qs.graphid;

    let newQs = queryString.stringify({search: qs.search, graphid: graphid, entityid: newEntityid})
    return {
      pathname: '/explore/entity',
      search: newQs
    };
  }
  renderBody() {
    switch(this.state.type){
      case 'person':
        return  (<span className="identifyingInfo">
                  <span className="info">[United Kingdom Companies House Business Registry]</span>
                </span>)
      case 'corporation':
        return (<div className="identifyingInfo">
                <div>{this.state.nationality} </div>
                <div className="info">{"Jurisdiction: " + this.state.jurisdiction}</div>
                <div className="info">{"Date Created: " + this.state.date_of_creation}</div>
              </div>)
      case 'Document':
        return <p>{"GCS Self: " + this.state.source }</p>
      default:
        return <p>Data type not supported.</p>
    }
  }

  render() {
    return (
      <div className="outerBox">
        <div className="heading">
          <div className="titleName underline">
            <Link to={this.state.link}>{this.state.name}</Link>
          </div>
          <i style={{marginRight: '8px'}}>{this.state.type}</i>
          <span className="identifyingInfo">
              <span className="info">[United Kingdom Companies House Business Registry]</span>
            </span>
            <div className="status">
              {this.state.company_status}
            </div>
          {this.renderBody(this.state.type)}
        </div>
      </div>
    )
  }
}
// }
// <hr></hr>
//           <SummaryInfo nodeItem={this.state.nodeData[0]} nodeRelationships={this.state.relationshipData} />

export default withRouter(EntityCard);
