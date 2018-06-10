import React, { Component } from "react";
import Rnd from "react-rnd";

import "./style.css";

class AreaHighlight extends Component {
    render() {
        const { highlight, onChange, ...otherProps } = this.props;

        return (
            <Rnd
                className="AreaHighlight"
                onDragStop={(_, data) => {
                    const boundingRect = {
                        ...highlight.position.boundingRect,
                        top: data.y,
                        left: data.x
                    };

                    onChange(boundingRect);
                }}
                onResizeStop={(_, direction, ref, delta, position) => {
                    const boundingRect = {
                        top: position.y,
                        left: position.x,
                        width: ref.offsetWidth,
                        height: ref.offsetHeight
                    };

                    onChange(boundingRect);
                }}
                default={{
                    x: highlight.position.boundingRect.left,
                    y: highlight.position.boundingRect.top,
                    width: highlight.position.boundingRect.width,
                    height: highlight.position.boundingRect.height
                }}
                onClick={event => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                {...otherProps}
            />
        );
    }
}

export default AreaHighlight;
