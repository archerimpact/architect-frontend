import React from "react";

const updateHash = highlight => {
    location.hash = `highlight-${highlight.id}`;
};

const Sidebar = ({ highlights, resetHighlights }) => {
    return (
        <div className="sidebar" style={{ width: "25vw" }}>
            <div className="description" style={{ padding: "1rem" }}>
                <h2 style={{ marginBottom: "1rem" }}>Tagged Entities</h2>
                <p>
                    <small>
                        To create area highlight hold ⌥ Option key (Alt), then click and
                        drag.
                    </small>
                </p>
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
};

export default Sidebar;
