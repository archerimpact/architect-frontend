import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import pdf_1 from './sample_files/a_dirks_news.pdf';
import pdf_2 from './sample_files/a_news_pdf.pdf';
import pdf_3 from './sample_files/a_pdf.pdf';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import SearchSources from './search';
import './documents.css';

class Documents extends Component {

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
                    <CardTitle title="Document name" subtitle="Some comments" />
                </Card>
                );
            });
        return documentItems;
    }

    render() {
        var docs = [pdf_1, pdf_2, pdf_3];
        return (
            <div className="sources">
                <SearchSources />
                <div className="documentList">
                    {this.documentList(docs)}
                </div>
            </div>
        );
    }
}

export default Documents