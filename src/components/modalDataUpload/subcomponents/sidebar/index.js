import React, { Component } from "react";
import { Button } from "antd";

const updateHash = highlight => {
    window.location.hash = `highlight-${highlight.id}`;
};

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceUploaded: false,
            modalVisible: false
        }
    }

    render() {
        const { highlights, resetHighlights, removeHighlightByIndex, showModal } = this.props;

        return (
            <div className="pdf-sidebar" style={{ width: "25vw" }}>
                <div className="description" style={{ padding: "1rem" }}>
                    <h2 style={{ marginBottom: "1rem" }}>Entities</h2>
                    <Button type="primary" onClick={showModal}>Create Entity</Button>
                    {
                        this.state.sourceUploaded ?
                            <p>
                                <small>
                                    To create area highlight hold ⌥ Option key (Alt), then click and
                                    drag.
                                </small>
                            </p>
                            :
                            <p></p>
                    }
                </div>
                <ul className="sidebar__highlights">
                    {highlights.map((highlight, index) => (
                        <li
                            key={index}
                            className="sidebar__highlight"
                            onClick={() => {
                                updateHash(highlight);
                            }}
                        >
                            <div>
                                <strong>{highlight.comment.text}</strong>
                                {highlight.content.text ? (
                                    <blockquote style={{ marginTop: "0.5rem" }}>
                                        {`${highlight.content.text.slice(0, 90).trim()}…`}
                                    </blockquote>
                                ) : null}
                                {highlight.content.image ? (
                                    <div
                                        className="highlight__image"
                                        style={{ marginTop: "0.5rem" }}
                                    >
                                        <img src={highlight.content.image} alt={"Screenshot"} />
                                    </div>
                                ) : null}
                            </div>
                            <div>
                                <button onClick={() => removeHighlightByIndex(index)}>
                                    X
                                </button>
                            </div>
                            {/* see if there's a better way to write this CHANGE DIS */}
                            <div className="highlight__location">
                                Page {highlight.position.pageNumber}
                            </div>
                        </li>
                    ))}
                </ul>
                {highlights.length > 0 ? (
                    <div style={{ padding: "1rem" }}>
                        <a href="#" onClick={resetHighlights}>
                            Reset Document
                        </a>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Sidebar;
