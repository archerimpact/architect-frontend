import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import pdf_1 from './files/a_dirks_news.pdf';
import pdf_2 from './files/a_news_pdf.pdf';
import pdf_3 from './files/a_pdf.pdf';
import pdf_4 from './files/trump.pdf'
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import './style.css';

import { Link } from 'react-router-dom';
import * as server_utils from '../../server/utils';
import * as actions from '../../redux/actions/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Sources extends Component {

    documentList(documents) {
        const documentItems = documents.map((document, i) => {
            return (
                <Card className="docCard" key={i}>
                    <CardMedia>
                        <Document file={document}>
                        {
                            <Page 
                                className="page" 
                                key={1} 
                                pageNumber={1} 
                                width={125}
                            />
                        }
                        </Document>
                    </CardMedia>
                    <CardTitle title={document.substring(14).slice(0, -13)} subtitle="Some comments" />
                </Card>
                );
            });
        return documentItems;
    }

    render() {
        var docs = [pdf_1, pdf_2, pdf_3, pdf_4];
        //this.props.documents get cloudReference
        return (
            <div className="sources">
                <div className="documentList">
                    {this.documentList(docs)}
                </div>
            </div>
        );
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

export default connect(mapStateToProps, mapDispatchToProps)(Sources);