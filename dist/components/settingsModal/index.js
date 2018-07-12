'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _reactModalDialog = require('react-modal-dialog');

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SettingsModal = function (_Component) {
  _inherits(SettingsModal, _Component);

  function SettingsModal() {
    _classCallCheck(this, SettingsModal);

    return _possibleConstructorReturn(this, (SettingsModal.__proto__ || Object.getPrototypeOf(SettingsModal)).apply(this, arguments));
  }

  _createClass(SettingsModal, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { onClick: this.props.handleClick },
        _react2.default.createElement(
          _reactModalDialog.ModalContainer,
          { onClose: this.props.handleClose },
          _react2.default.createElement(
            _reactModalDialog.ModalDialog,
            { onClose: this.props.handleClose },
            _react2.default.createElement(
              'div',
              { className: 'modal-content' },
              _react2.default.createElement(
                'h1',
                null,
                'Graph settings'
              ),
              _react2.default.createElement(
                'div',
                { className: 'settings-entry' },
                _react2.default.createElement('input', { type: 'checkbox', id: 'toggle-minimap', onChange: function onChange() {}, checked: true }),
                _react2.default.createElement(
                  'label',
                  { htmlFor: 'toggle-minimap' },
                  'Show minimap'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return SettingsModal;
}(_react.Component);

function handleToggleMinimap() {}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(SettingsModal));