import React, { Component } from "react";
import ReactDom from "react-dom";
import Pointable from "react-pointable";
import TipContainer from "../tipContainer";
import MouseSelection from "../mouseSelection";
import _ from "lodash/fp";
import { PDFViewer, PDFLinkService } from "pdfjs-dist/web/pdf_viewer";

import "pdfjs-dist/web/pdf_viewer.css";
import "./style.css";

import getBoundingRect from "../../lib/getBoundingRect";
import getClientRects from "../../lib/getClientRects";
import getAreaAsPng from "../../lib/getAreaAsPng";

import {
    getPageFromRange,
    getPageFromElement,
    findOrCreateContainerLayer
} from "../../lib/pdfjsDOM";

import { scaledToViewport, viewportToScaled } from "../../lib/coordinates";

const EMPTY_ID = "empty-id";

const disableEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
let clickTimeoutId;

class PdfAnnotator extends Component {
    state = {
        ghostHighlight: null,
        isCollapsed: true,
        range: null,
        scrolledToHighlightId: EMPTY_ID
    };

    viewer = null;
    containerNode = null;

    componentWillReceiveProps(nextProps) {
        if (this.props.highlights !== nextProps.highlights) {
            this.renderHighlights(nextProps);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const { pdfDocument } = this.props;
        debugger;
        this.debouncedAfterSelection = _.debounce(500, this.afterSelection);
        this.linkService = new PDFLinkService();

        this.viewer = new PDFViewer({
            container: this.containerNode,
            enhanceTextSelection: true,
            removePageBorders: true,
            linkService: this.linkService
        });

        this.viewer.setDocument(pdfDocument);
        this.linkService.setDocument(pdfDocument);

        // debug
        window.PdfViewer = this;

        window.oncontextmenu = disableEvent;

        document.addEventListener("selectionchange", this.onSelectionChange);
        document.addEventListener("keydown", this.handleKeyDown);

        this.containerNode &&
        this.containerNode.addEventListener("pagesinit", () => {
            this.onDocumentReady();
        });

        this.containerNode &&
        this.containerNode.addEventListener(
            "textlayerrendered",
            this.onTextLayerRendered
        );
    }

    componentWillUnmount() {
        document.removeEventListener("selectionchange", this.onSelectionChange);
        document.removeEventListener("keydown", this.handleKeyDown);

        this.containerNode &&
        this.containerNode.removeEventListener(
            "textlayerrendered",
            this.onTextLayerRendered
        );
    }

    findOrCreateHighlightLayer(page) {
        const textLayer = this.viewer.getPageView(page - 1).textLayer;

        if (!textLayer) {
            return null;
        }

        return findOrCreateContainerLayer(
            textLayer.textLayerDiv,
            "PdfAnnotator__highlight-layer"
        );
    }

    groupHighlightsByPage(highlights) {
        const { ghostHighlight } = this.state;

        return [...highlights, ghostHighlight]
        .filter(Boolean)
        .reduce((res, highlight) => {
            const { pageNumber } = highlight.position;

            res[pageNumber] = res[pageNumber] || [];
            res[pageNumber].push(highlight);

            return res;
        }, {});
    }

    showTip(highlight, content) {
        const {
            isCollapsed,
            ghostHighlight,
            isAreaSelectionInProgress
        } = this.state;

        const highlightInProgress = !isCollapsed || ghostHighlight;

        if (highlightInProgress || isAreaSelectionInProgress) {
            return;
        }

        this.renderTipAtPosition(highlight.position, content);
    }

    scaledPositionToViewport(pageNumber, boundingRect, rects, usePdfCoordinates) {
        const viewport = this.viewer.getPageView(pageNumber - 1).viewport;

        return {
            boundingRect: scaledToViewport(boundingRect, viewport, usePdfCoordinates),
            rects: (rects || []).map(rect =>
                scaledToViewport(rect, viewport, usePdfCoordinates)
            ),
            pageNumber
        };
    }

    viewportPositionToScaled(pageNumber, boundingRect, rects) {
        const viewport = this.viewer.getPageView(pageNumber - 1).viewport;

        return {
            boundingRect: viewportToScaled(boundingRect, viewport),
            rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
            pageNumber
        };
    }

    screenshot(position, pageNumber) {
        const canvas = this.viewer.getPageView(pageNumber - 1).canvas;

        return getAreaAsPng(canvas, position);
    }

    renderHighlights(nextProps) {
        const { highlightTransform, highlights } = nextProps || this.props;

        const { pdfDocument } = this.props;

        const { tip, scrolledToHighlightId } = this.state;

        const highlightsByPage = this.groupHighlightsByPage(highlights);

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            const highlightLayer = this.findOrCreateHighlightLayer(pageNumber);

            if (highlightLayer) {
                ReactDom.render(
                    <div>
                        {(highlightsByPage[String(pageNumber)] || []).map(
                            (highlight, index) => {
                                const { position, ...rest } = highlight;

                                const viewportHighlight = {
                                    position: this.scaledPositionToViewport(position),
                                    ...rest
                                };

                                if (tip && tip.highlight.id === String(highlight.id)) {
                                    this.showTip(tip.highlight, tip.callback(viewportHighlight));
                                }

                                const isScrolledTo = Boolean(
                                    scrolledToHighlightId === highlight.id
                                );

                                return highlightTransform(
                                    viewportHighlight,
                                    index,
                                    (highlight, callback) => {
                                        this.setState({
                                            tip: { highlight, callback }
                                        });

                                        this.showTip(highlight, callback(highlight));
                                    },
                                    this.hideTipAndSelection,
                                    rect => {
                                        const viewport = this.viewer.getPageView(pageNumber - 1)
                                            .viewport;

                                        return viewportToScaled(rect, viewport);
                                    },
                                    boundingRect => this.screenshot(boundingRect, pageNumber),
                                    isScrolledTo
                                );
                            }
                        )}
                    </div>,
                    highlightLayer
                );
            }
        }
    }

    hideTipAndSelection = () => {
        const tipNode = findOrCreateContainerLayer(
            this.viewer.viewer,
            "PdfAnnotator__tip-layer"
        );

        ReactDom.unmountComponentAtNode(tipNode);

        this.setState({ ghostHighlight: null, tip: null }, () =>
            this.renderHighlights()
        );
    };

    renderTipAtPosition(position, inner) {
        const { boundingRect, pageNumber } = position;

        const page = {
            node: this.viewer.getPageView(pageNumber - 1).div
        };

        const pageBoundingRect = page.node.getBoundingClientRect();

        const tipNode = findOrCreateContainerLayer(
            this.viewer.viewer,
            "PdfAnnotator__tip-layer"
        );

        ReactDom.render(
            <TipContainer
                scrollTop={this.viewer.container.scrollTop}
                pageBoundingRect={pageBoundingRect}
                style={{
                    left:
                    page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
                    top: boundingRect.top + page.node.offsetTop,
                    bottom: boundingRect.top + page.node.offsetTop + boundingRect.height
                }}
                children={inner}
            />,
            tipNode
        );
    }

    onTextLayerRendered = () => {
        this.renderHighlights();
    };

    scrollTo = (highlight) => {
        const { pageNumber, boundingRect, usePdfCoordinates } = highlight.position;

        this.viewer.container.removeEventListener("scroll", this.onScroll);

        const pageViewport = this.viewer.getPageView(pageNumber - 1).viewport;

        const scrollMargin = 10;

        this.viewer.scrollPageIntoView({
            pageNumber,
            destArray: [
                null,
                { name: "XYZ" },
                ...pageViewport.convertToPdfPoint(
                    0,
                    scaledToViewport(boundingRect, pageViewport, usePdfCoordinates).top -
                    scrollMargin
                ),
                0
            ]
        });

        this.setState( {scrolledToHighlightId: highlight.id}, () => this.renderHighlights() );

        // wait for scrolling to finish
        setTimeout(() => {
            this.viewer.container.addEventListener("scroll", this.onScroll);
        }, 100);
    };

    onDocumentReady = () => {
        const { scrollRef } = this.props;

        this.viewer.currentScaleValue = "auto";

        scrollRef(this.scrollTo);
    };

    onSelectionChange = () => {
        const selection = window.getSelection();

        if (selection.isCollapsed) {
            this.setState({ isCollapsed: true });
            return;
        }

        const range = selection.getRangeAt(0);

        if (!range) {
            return;
        }

        this.setState({
            isCollapsed: false,
            range
        });

        this.debouncedAfterSelection();
    };

    onScroll = () => {
        const { onScrollChange } = this.props;

        onScrollChange();

        this.setState(
            {
                scrolledToHighlightId: EMPTY_ID
            },
            () => this.renderHighlights()
        );

        this.viewer.container.removeEventListener("scroll", this.onScroll);
    };

    onMouseDown = (event) => {
        if (!(event.target instanceof HTMLElement)) {
            return;
        }

        if (event.target.closest(".PdfAnnotator__tip-container")) {
            return;
        }

        this.hideTipAndSelection();
    };

    handleKeyDown = (event) => {
        if (event.code === "Escape") {
            this.hideTipAndSelection();
        }
    };

    afterSelection = () => {
        const { onSelectionFinished } = this.props;

        const { isCollapsed, range } = this.state;

        if (!range || isCollapsed) {
            return;
        }

        const page = getPageFromRange(range);

        if (!page) {
            return;
        }

        const rects = getClientRects(range, page.node);

        if (rects.length === 0) {
            return;
        }

        const boundingRect = getBoundingRect(rects);

        const viewportPosition = { boundingRect, rects, pageNumber: page.number };

        const content = {
            text: range.toString()
        };
        const scaledPosition = this.viewportPositionToScaled(viewportPosition);

        this.renderTipAtPosition(
            viewportPosition,
            onSelectionFinished(
                scaledPosition,
                content,
                () => this.hideTipAndSelection(),
                () =>
                    this.setState(
                        {
                            ghostHighlight: { position: scaledPosition }
                        },
                        () => this.renderHighlights()
                    )
            )
        );
    };

    toggleTextSelection(flag) {
        this.viewer.viewer.classList.toggle(
            "PdfAnnotator--disable-selection",
            flag
        );
    }

    render() {
        const { onSelectionFinished, enableAreaSelection } = this.props;

        return (
            <Pointable onPointerDown={this.onMouseDown}>
                <div ref={node => (this.containerNode = node)} className="PdfAnnotator">
                    <div className="pdfViewer" />
                    {typeof enableAreaSelection === "function" ? (
                        <MouseSelection
                            onDragStart={() => this.toggleTextSelection(true)}
                            onDragEnd={() => this.toggleTextSelection(false)}
                            onChange={isVisible =>
                                this.setState({ isAreaSelectionInProgress: isVisible })
                            }
                            shouldStart={event =>
                            enableAreaSelection(event) &&
                            event.target instanceof HTMLElement &&
                            Boolean(event.target.closest(".page"))
                            }
                            onSelection={(startTarget, boundingRect, resetSelection) => {
                                const page = getPageFromElement(startTarget);

                                if (!page) {
                                    return;
                                }

                                const pageBoundingRect = {
                                    ...boundingRect,
                                    top: boundingRect.top - page.node.offsetTop,
                                    left: boundingRect.left - page.node.offsetLeft
                                };

                                const viewportPosition = {
                                    boundingRect: pageBoundingRect,
                                    rects: [],
                                    pageNumber: page.number
                                };

                                const scaledPosition = this.viewportPositionToScaled(
                                    viewportPosition
                                );

                                const image = this.screenshot(pageBoundingRect, page.number);

                                this.renderTipAtPosition(
                                    viewportPosition,
                                    onSelectionFinished(
                                        scaledPosition,
                                        { image },
                                        () => this.hideTipAndSelection(),
                                        () =>
                                            this.setState(
                                                {
                                                    ghostHighlight: {
                                                        position: scaledPosition,
                                                        content: { image }
                                                    }
                                                },
                                                () => {
                                                    resetSelection();
                                                    this.renderHighlights();
                                                }
                                            )
                                    )
                                );
                            }}
                        />
                    ) : null}
                </div>
            </Pointable>
        );
    }
}

export default PdfAnnotator;
