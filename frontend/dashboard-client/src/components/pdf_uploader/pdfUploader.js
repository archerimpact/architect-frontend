import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import RaisedButton from 'material-ui/RaisedButton';
import * as server_utils from '../../server/utils';
import './pdf_uploader.css';
import 'whatwg-fetch';

class PDFUploader extends Component {
	constructor(props) {
		super(props);
		this.state = {
            file: null,
            numPages: null,
            pageNumber: 1,
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
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
	}

    onFileChange(event) {
        this.setState({
            file: event.target.files[0],
        });
        server_utils.saveDocument(event.target.files[0]);
    }

	onDocumentLoadSuccess({numPages}) {
		this.setState({numPages: numPages, pageNumber: null,});
	}

    // Can be added later to allow page changes if only one page is displayed at a time
/*    changePage(by) {
       this.setState(prevState => ({
           pageNumber: prevState.pageNumber + by,
       }))
    }*/

    render() {
        return (
        	<div className="pdf">
                <div className="loader">
                    <RaisedButton 
                        label="File upload" 
                        labelPosition="before" 
                        containerElement="label" 
                        style={this.state.styles.button} 
                        primary={true}
                    >
                        <input 
                            type="file" 
                            onChange={this.onFileChange} 
                            style={this.state.styles.documentInput}
                        />
                    </RaisedButton>
                </div>
                <div className="addDocument">
                    <Document file={this.state.file} onLoadSuccess={this.onDocumentLoadSuccess} >
                    {
                        Array.from(new Array(this.state.numPages),
                            (el, index) => (
                                <Page 
                                    className="page" 
                                    key={index + 1} 
                                    pageNumber={index+1} 
                                    width={Math.min(600, document.body.clientWidth - 52)}
                                />
                            ),
                        )
                    }
                    </Document>
                </div>
            </div>
        );
    }
}

export default PDFUploader