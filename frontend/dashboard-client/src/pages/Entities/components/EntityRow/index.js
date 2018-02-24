import React, {Component} from 'react';
import './style.css'

import RaisedButton from 'material-ui/RaisedButton';

import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Create from 'material-ui/svg-icons/content/create';
import Grade from 'material-ui/svg-icons/action/grade';

import Person from 'material-ui/svg-icons/social/person';
import Entity from 'material-ui/svg-icons/social/domain';
import Location from 'material-ui/svg-icons/communication/location-on';
import Nationality from 'material-ui/svg-icons/content/flag';
import Document from 'material-ui/svg-icons/av/note';
import {Link} from 'react-router-dom';

class EntityRow extends Component {

    renderIcon(type) {
      if (type.toLowerCase() === "person") {
        return <Person className="icon"/>
      }
      if (type.toLowerCase() === "document") {
        return <Document className="icon"/>
      }
      if (type.toLowerCase() ==="organization" || type.toLowerCase() === "company" || type.toLowerCase() === "corporation") {
        return <Entity className="icon"/>
      }
      if (type.toLowerCase() === "location") {
        return <Location className="icon"/>
      }
      if (type.toLowerCase() === "nationality") {
        return <Nationality className="icon"/>
      }
      return <div className="icon"/>
    }
  render() {
    /*if (this.props.listType === "suggested_entities") {
      return (
        <div className="entityCard" onClick={() => this.props.onEntityClick(this.props.entity)}>
            <div className="cardHeader">
                {this.renderIcon(this.props.entity)}
                <div className="cardHeaderText">
                    <span className="title"> {this.props.entity.qid && this.props.entity.qid.charAt(0) !== "T" ? <a href={"https://www.wikidata.org/wiki/" + this.props.entity.qid}>{this.props.entity.name} </a> : this.props.entity.name}</span>
                    <span className="type">{this.props.entity.type}</span>
                    <RaisedButton label="Create Entity" onClick={()=>this.props.onCreateEntity(this.props.entity)} />
                    <RaisedButton label="Delete" onClick={()=>this.props.onDeleteEntity(this.props.entity)} />
                </div>
            </div>
            <div className="cardBody">
                {this.renderSourceLink(this.props.entity, this.props.getSource)}
            </div>
        </div>
    );
    }
    else {*/
      return (
          <div className="entityRow">
              <div className="iconBox">
                {this.renderIcon(this.props.entity.entity.type)}
              </div>
              <div className="information">
                  <div className="titleColumn">
                      <div className="title"> {this.props.entity.qid && this.props.entity.qid.charAt(0) !== "T" ? <a href={"https://www.wikidata.org/wiki/" + this.props.entity.qid}>{this.props.entity.name} </a> : this.props.entity.name}</div>
                      <div className="typeBox">
                        <div className="typeText">
                        {this.props.entity.entity.type}
                        </div>
                      </div>
                  </div>
                  <div className="column text">
                    {this.props.entity.connections.length + " connections"}
                  </div>
                  <div className="column text">
                    {this.props.entity.entity.sources.length + " sources"}
                  </div>
              </div>
              <div className="actions">
                <IconButton className="actionButton" onClick={()=>this.props.onDeleteEntity(this.props.entity, "entities")} >
                  <Delete />
                </IconButton>
                <IconButton className="actionButton">
                  <Grade />
                </IconButton>
                <IconButton className="actionButton">
                  <Create />
                </IconButton>
              </div>
          </div>
      );
    /*}*/
  }
}

export default EntityRow;