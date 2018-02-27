import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import './style.css';

import { Link, withRouter } from 'react-router-dom';
import * as server_utils from '../../server/utils';
import * as actions from '../../redux/actions/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import sample_file from './files/a_news_pdf.pdf';

class Sources extends Component {

    constructor(props) {
      super(props);
      this.state = {
        document: '',
        loaded: false,
      };
      this.documentList = this.documentList.bind(this);
      this.things = this.things.bind(this);
    }

    documentList(documents) {
        var documentItems = documents.map((document, i) => {
          var newDoc = {
            httpHeaders: document.headers,
            data: document.data
          }
          debugger
            return (
                  <Document file={newDoc}>
                  {
                      <Page 
                          className="page" 
                          key={1} 
                          pageNumber={1, 2} 
                          width={125}
                      />
                  }
                  </Document>
                );
            });
        return documentItems;
    }

    things() {
      server_utils.retrieveDocument('a_dirks_news.pdf')
        .then(data => {
          console.log("DOCUMENT: ");

        /*var friend= URL.createObjectURL(new Blob([data], {
                    type: "application/pdf"
                  }))*/
          console.log(data);
          window.open("data:application/pdf;base64, " + data.data);
          // var name = data.params;
          // console.log(name);
          // var piece = data.data;
          this.setState({document: data, loaded: true});
        })

    }

    render() {
      console.log(sample_file);
      this.things();
      if (this.state.loaded) {
        return (
          <div className="sources">
              <div className="documentList">
                  {this.documentList([this.state.document])}
              </div>
          </div>
        );
      }
      else {
        return (
          <div className="sources">
              <div className="documentList">
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