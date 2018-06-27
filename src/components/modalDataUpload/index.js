import React, { Component } from 'react';
import URLSearchParams from "url-search-params";
import { Modal, Button } from 'antd';
import {
    PdfLoader,
    PdfAnnotator,
    Tip,
    Highlight,
    Popup,
    AreaHighlight,
    Sidebar,
    Spinner
} from "./subcomponents";

import './style.css'

// TODO import transitions and styling from antd (see them for inspiration). this includes bulk upload.
// TODO allow links within the document to go to other documents or within page docs

/* ======================================= HELPER FUNCTIONS ===================================== */

const getNextId = () => String(Math.random()).slice(2);
const parseIdFromHash = () => window.location.hash.slice("#highlight-".length);
const resetHash = () => { window.location.hash = "" };
const HighlightPopup = ({ comment }) =>
    comment.text ? (
        <div className="Highlight__popup">
            {comment.emoji} {comment.text}
        </div>
    ) : null;

const searchParams = new URLSearchParams(window.location.search);
const url = searchParams.get("url") || "http://www.nber.org/papers/w20625.pdf";
// CHANGE HERE TO ACTUAL PDF (modal first takes URL or drags to upload CHANGE DIS
// ALSO DEAL WITH CORS CHANGE DIS
// TODO add search to sidebar

/* =============================================================================================== */

class ModalDataUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            highlights: [],
            modalVisible: false
        }
    }

    componentDidMount() {
        window.addEventListener(
            "hashchange",
            this.scrollToHighlightFromHash,
            false
        );
    };

    scrollViewerTo = (highlight) => {};

    scrollToHighlightFromHash = () => {
        const highlight = this.getHighlightById(parseIdFromHash());

        if (highlight) {
            this.scrollViewerTo(highlight);
        }
    };

    resetHighlights = () => {
        this.setState({
            highlights: []
        });
    };

    getHighlightById(id) {
        const { highlights } = this.state;

        return highlights.find(highlight => highlight.id === id);
    }

    removeHighlightByIndex = (index) => {
        const { highlights } = this.state;

        let newHighlights = [...highlights];
        newHighlights.splice(index, 1);
        this.setState({
            highlights: newHighlights
        });
    };

    addHighlight(highlight) {
        const { highlights } = this.state;

        this.setState({
            highlights: [{ ...highlight, id: getNextId() }, ...highlights]
        });
    }

    updateHighlight(highlightId, position, content) {
        this.setState({
            highlights: this.state.highlights.map(h => {
                return h.id === highlightId
                    ? {
                        ...h,
                        position: { ...h.position, ...position },
                        content: { ...h.content, ...content }
                    }
                    : h;
            })
        });
    }

    showCreateEntityModal = () => {
        console.log(this.state.modalVisible)
        this.setState({
            modalVisible: true,
        });
    };

    handleCreateEntityOk = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    handleCreateEntityCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    };

    render() {
        const { handleClose, show } = this.props; // change the true to show CHANGE DIS
        const { highlights } = this.state;
        return (
            <div className={true ? "modal display-block" : "modal display-none"}>
                <Modal
                    title="Create Entity Modal"
                    visible={this.state.modalVisible}
                    onOk={this.handleCreateEntityOk}
                    onCancel={this.handleCreateEntityCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
                <section className="modal-main">
                    {/*<button className="close-modal-button" onClick={handleClose}>close</button>*/}
                    <div style={{display: "flex"}}>
                        <Sidebar
                            highlights={highlights}
                            resetHighlights={this.resetHighlights}
                            removeHighlightByIndex={this.removeHighlightByIndex}
                            showModal={this.showCreateEntityModal}
                        />
                        <div
                            style={{
                                height: "100vh",
                                width: "75vw",
                                overflowY: "scroll",
                                position: "relative"
                            }}
                        >
                            {/*<PdfLoader url={url} beforeLoad={<Spinner />}>*/}
                                {/*{pdfDocument => (*/}
                                    {/*<PdfAnnotator*/}
                                        {/*pdfDocument={pdfDocument}*/}
                                        {/*enableAreaSelection={event => event.altKey}*/}
                                        {/*onScrollChange={resetHash}*/}
                                        {/*scrollRef={scrollTo => {this.scrollViewerTo = scrollTo; this.scrollToHighlightFromHash();}}*/}
                                        {/*url={url}*/}
                                        {/*highlights={highlights}*/}
                                        {/*onSelectionFinished={(position, content, hideTipAndSelection, transformSelection) => (*/}
                                            {/*<Tip*/}
                                                {/*onOpen={transformSelection}*/}
                                                {/*onConfirm={comment => {*/}
                                                    {/*this.addHighlight({ content, position, comment });*/}
                                                    {/*hideTipAndSelection();*/}
                                                {/*}}*/}
                                            {/*/>*/}
                                        {/*)}*/}
                                        {/*highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {*/}
                                            {/*const isTextHighlight = !Boolean(*/}
                                                {/*highlight.content && highlight.content.image*/}
                                            {/*);*/}

                                            {/*const component = isTextHighlight ? (*/}
                                                    {/*<Highlight*/}
                                                        {/*isScrolledTo={isScrolledTo}*/}
                                                        {/*position={highlight.position}*/}
                                                        {/*comment={highlight.comment}*/}
                                                    {/*/>*/}
                                                {/*) : (*/}
                                                    {/*<AreaHighlight*/}
                                                        {/*highlight={highlight}*/}
                                                        {/*onChange={boundingRect => {*/}
                                                            {/*this.updateHighlight(*/}
                                                                {/*highlight.id,*/}
                                                                {/*{ boundingRect: viewportToScaled(boundingRect) },*/}
                                                                {/*{ image: screenshot(boundingRect) }*/}
                                                            {/*);*/}
                                                        {/*}}*/}
                                                    {/*/>*/}
                                                {/*);*/}

                                            {/*return (*/}
                                                {/*<Popup*/}
                                                    {/*popupContent={<HighlightPopup {...highlight} />}*/}
                                                    {/*onMouseOver={popupContent =>*/}
                                                        {/*setTip(highlight, highlight => popupContent)*/}
                                                    {/*}*/}
                                                    {/*onMouseOut={hideTip}*/}
                                                    {/*key={index}*/}
                                                    {/*children={component}*/}
                                                {/*/>*/}
                                            {/*);*/}
                                        {/*}}*/}
                                    {/*/>*/}
                                {/*)}*/}
                            {/*</PdfLoader>*/}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};

export default ModalDataUpload