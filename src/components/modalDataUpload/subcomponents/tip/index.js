import React, { Component } from "react";
import { Select } from 'antd';
import {fetchTypes} from '../../../../redux/actions/projectActions';
import {connect} from 'react-redux';

import "./style.css";

class Tip extends Component {
    state = {
        compact: true,
        type: null,
        text: "",
        types: []
    };

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(fetchTypes()).then((typeList) => {
            this.setState({types: typeList})
        })
    }

    // for TipContainer
    componentDidUpdate(nextProps, nextState) {
        const { onUpdate } = this.props;

        if (onUpdate && this.state.compact !== nextState.compact) {
            onUpdate();
        }
    }

    handleTypeChange = (type) => {
        this.setState({type});
    };

    render() {
        const { onConfirm, onOpen } = this.props;
        const { compact, text, types } = this.state;

        return (
            <div className="Tip">
                {compact ? (
                    <div
                        className="Tip__compact"
                        onClick={() => {
                            onOpen();
                            this.setState({ compact: false });
                        }}
                    >
                        Tag Entity
                    </div>
                ) : (
                    <form
                        className="Tip__card"
                        onSubmit={event => {
                            event.preventDefault();
                            onConfirm({ text });
                        }}
                    >
                        <div>
                          <Select
                              mode="tags"
                              style={{ width: '100%' }}
                              placeholder="Type"
                              onChange={this.handleTypeChange}
                              maxTagCount={1}
                          >
                              {types.map((entity_type) => {
                                  return (
                                      <Select.Option>{entity_type}</Select.Option>
                                  )
                              })}
                          </Select>
                          <textarea
                              width="100%"
                              placeholder="Your comment"
                              autoFocus
                              value={text}
                              onChange={event => this.setState({ text: event.target.value })}
                              ref={node => {
                                  if (node) {
                                      node.focus();
                                  }
                              }}
                          />
                        </div>
                        <div>
                            <input type="submit" value="Save" />
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch,
    };
}

export default connect(mapDispatchToProps)(Tip);
