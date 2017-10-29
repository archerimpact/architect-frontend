import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import pdf_1 from './sample_files/a_dirks_news.pdf';
import pdf_2 from './sample_files/a_news_pdf.pdf';
import pdf_3 from './sample_files/a_pdf.pdf';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';
import './documents.css';

class Documents extends Component {
	constructor(props) {
		super(props);
		this.state = {
            styles: {
                button: {
                    margin: 12,
                },
                documentInput: {
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    width: '100%',
                    opacity: 0,
                },
            }
        };
	}

    documentList(documents) {
        const documentItems = documents.map((document) => {
            return (
                <Card className="docCard">
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
            <div className="documentList">
                {this.documentList(docs)}
            </div>
        );
    }
}

export default Documents