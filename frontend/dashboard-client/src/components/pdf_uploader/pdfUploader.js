import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import RaisedButton from 'material-ui/RaisedButton';
import './pdf_uploader.css';
import 'whatwg-fetch';

class PDFUploader extends Component {
	constructor() {
		super();
		this.state = {
            file: null,
            numPages: null,
            pageNumber: 1,
        };
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        // this.changePage = this.changePage.bind(this);
	}

    onFileChange(event) {
        this.setState({
            file: event.target.files[0],
        });

        const data = new FormData();
        data.append('file', event.target.files[0]);
        data.append('originalname', 'random_file_name');
        var url = 'http://localhost:8000/pdf-uploader';
        var options = {
            method: 'POST',
            body: data
        };
        fetch(url, options)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log('Error: could not upload document because: ' + err);
        });
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
        const styles = {
          button: {
            margin: 12,
          },
          exampleImageInput: {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: '100%',
            opacity: 0,
          },
        };

        return (
        	<div className="pdf">
                <div className="loader">
                    <RaisedButton 
                        label="File upload" 
                        labelPosition="before" 
                        containerElement="label" 
                        style={styles.button} 
                        primary={true}
                    >
                        <input 
                            type="file" 
                            onChange={this.onFileChange} 
                            style={styles.exampleImageInput}
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