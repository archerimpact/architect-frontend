import React, { Component } from 'react';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import RaisedButton from 'material-ui/RaisedButton';
import * as server_utils from '../../server/utils';
import './style.css';
import 'whatwg-fetch';

class PDFUploader extends Component {
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
            },
            fileUploaded: ''
        };
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
	}

    onFileChange(event) {
        console.log("id:");
        console.log(this.props.projectid);
        this.setState({ fileUploaded: event.target.files[0].name + " uploaded"});
        server_utils.saveDocument(event.target.files[0], this.props.projectid);
    }

	onDocumentLoadSuccess({numPages}) {
		this.setState({numPages: numPages, pageNumber: null,});
	}

    render() {
        return (
        	<div className="pdf">
                <div className="loader">
                    <RaisedButton 
                        label="Upload PDF" 
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
                    <h5>{this.state.fileUploaded}</h5>
                </div>
            </div>
        );
    }
}

export default PDFUploader