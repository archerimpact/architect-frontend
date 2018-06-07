import React, { Component } from "react";
import pdfjs from "pdfjs-dist/webpack";

class PdfLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfDocument: null
        }
    }

    componentDidMount() {
        const { url } = this.props;

        pdfjs.getDocument(url).then(pdfDocument => {
            this.setState({
                pdfDocument: pdfDocument
            });
        });
    }

    render() {
        const { children, beforeLoad } = this.props;
        const { pdfDocument } = this.state;

        if (pdfDocument) {
            return children(pdfDocument);
        }

        return beforeLoad;
    }
}

export default PdfLoader;
