import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

import './style.css'

class HelpModal extends Component {
  render() {
    return (
      <div onClick={this.props.handleClick}>
        <ModalContainer onClose={this.props.handleClose}>
          <ModalDialog onClose={this.props.handleClose}>
            <div className="modal-content">
              <h1>Graph usage</h1>
              <table>
                <tbody>
                  <tr>
                    <td className="rule">Move node</td>
                    <td className="hotkey">
                      <p className="code">left click</p>
                      <p>{'\u00A0'}+{'\u00A0'}</p>
                      <p className="code">drag</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="rule">Select nodes</td>
                    <td className="hotkey">
                      <p className="code">right click</p>
                      <p>{'\u00A0'}+{'\u00A0'}</p>
                      <p className="code">drag</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="rule">Expand node</td>
                    <td className="hotkey">
                      <p className="code">double click</p>
                    </td>
                  </tr>
                  {/*<tr>*/}
                    {/*<td className="rule">(Un)fix selected nodes</td>*/}
                    {/*<td className="hotkey">*/}
                      {/*<p className="code">alt</p>*/}
                      {/*<p>{'\u00A0'}+{'\u00A0'}</p>*/}
                      {/*<p className="code">f</p>*/}
                    {/*</td>*/}
                  {/*</tr>*/}
                  <tr>
                    <td className="rule">Delete selected nodes</td>
                    <td className="hotkey">
                      <p className="code">r</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ModalDialog>
        </ModalContainer>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

export default withRouter(connect(mapDispatchToProps)(HelpModal));
