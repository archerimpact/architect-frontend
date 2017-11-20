import React, {Component} from 'react';
import './style.css'

import Person from 'material-ui/svg-icons/social/person';
import Entity from 'material-ui/svg-icons/social/domain';
import Location from 'material-ui/svg-icons/communication/location-on';
import Nationality from 'material-ui/svg-icons/content/flag';
import Document from 'material-ui/svg-icons/av/note';
import {Link} from 'react-router-dom';

class EntityCard extends Component {

    constructor(props) {
        super(props);
        this.renderSourceLink = this.renderSourceLink.bind(this);
    }

    renderIcon(entity) {
        if (entity.type === "Person" || entity.type === "PERSON") {
          return <Person className="icon" />
        }
        if ( entity.type === "DOCUMENT") {
          return <Document className="icon" />
        }
        if (entity.type ==="ORGANIZATION" || entity.type === "Company") {
          return <Entity className="icon" />
        }
        if (entity.type === "Location" || entity.type === "LOCATION") {
          return <Location className="icon" />
        }
        if (entity.type === "NATIONALITY") {
          return <Nationality className="icon" />
        }
    }

    renderSourceLink(entity, getSource) {
        var docText = getSource(entity);
        var docText15words = docText.replace(/(([^\s]+\s\s*){15})(.*)/,"$1…");
        return (
            <div>
                <span className="type"><Link to={"/source/"+entity.sources}><b>Source:</b></Link>{" " +docText15words}</span>
            </div>
        );
    }
  render() {
    return (
        <div className="entityCard" onClick={() => this.props.onEntityClick(this.props.entity)}>
            <div className="cardHeader">
                {this.renderIcon(this.props.entity)}
                <div className="cardHeaderText">
                    <span className="title"> {this.props.entity.qid && this.props.entity.qid.charAt(0) !== "T" ? <a href={"https://www.wikidata.org/wiki/" + this.props.entity.qid}>{this.props.entity.name} </a> : this.props.entity.name}</span>
                    <span className="type">{this.props.entity.type}</span>
                </div>
            </div>
            <div className="cardBody">
                {this.renderSourceLink(this.props.entity, this.props.getSource)}
            </div>
        </div>
    );
  }
}

export default EntityCard;