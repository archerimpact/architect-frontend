import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import './style.css';

import { Link, withRouter } from 'react-router-dom';
import * as server_utils from '../../server/utils';
import * as actions from '../../redux/actions/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Sources extends Component {

    constructor(props) {
      super(props);
      this.state = {
        document: '',
        loaded: false,
        page: 1
      };
      this.getDocument = this.getDocument.bind(this);
      this.getDocument();
      this.documentRender = this.documentRender.bind(this);
      this.toPrevious = this.toPrevious.bind(this);
      this.toNext = this.toNext.bind(this);
      this.onDocumentLoad = this.onDocumentLoad.bind(this);
    }

    toPrevious = (event) => {
      event.preventDefault();
      var page = this.state.page - 1;
      if (page > 0) {
        this.setState({
          page: page,
        });
      }
      
    };

    toNext = (event) => {
      event.preventDefault();
      var page = this.state.page + 1;
      if (this.state.numPages && page <= this.state.numPages) {
        this.setState({
          page: page,
        });
      }
      
    };

    onDocumentLoad = ({ numPages }) => {
      this.setState({ numPages: numPages });
    }

    documentRender(document) {
        return (
              <Document file={document} onLoadSuccess={this.onDocumentLoad}>
              {
                  <Page 
                      className="page" 
                      key={1} 
                      pageNumber={this.state.page} 
                      width={400}
                  />
              }
              </Document>
            );
    }

    getDocument() {
      server_utils.retrieveDocument(this.props.sourceid)
        .then(data => {
          this.setState({document: data, loaded: true});
        })

    }

    render() {

      const style = {
        margin: 12,
      };

      if (this.state.loaded) {
        return (
          <div className="sources">
              <div className="documentRender">
                  {this.documentRender(this.state.document)}
              </div>
              <div className="pageChange">
                <RaisedButton label="Previous Page" primary={true} style={style} onClick={this.toPrevious}/>
                <RaisedButton label="Next Page" primary={true} style={style} onClick={this.toNext}/>
              </div>
          </div>
        );
      }
      else {
        return (
          <div className="sources">
              <div className="documentRender">
                  Loading
              </div>
          </div>
        )
      }

      
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

function mapStateToProps(state) {
  if (state.data.savedSources.status === 'isLoading') {
    return {
      status: state.data.savedSources.status,
      }
  } else {
      return {
      status: state.data.savedSources.status,
          documents: state.data.savedSources.documents,
      }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sources));