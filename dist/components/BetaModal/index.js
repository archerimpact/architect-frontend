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

var _signUpForm = require('../signUpForm');

var _signUpForm2 = _interopRequireDefault(_signUpForm);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BetaModal = function (_Component) {
  _inherits(BetaModal, _Component);

  function BetaModal() {
    _classCallCheck(this, BetaModal);

    return _possibleConstructorReturn(this, (BetaModal.__proto__ || Object.getPrototypeOf(BetaModal)).apply(this, arguments));
  }

  _createClass(BetaModal, [{
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
              { id: 'beta-modal-content', className: 'modal-content' },
              _react2.default.createElement(
                'h3',
                { className: 'modal-title text-center' },
                'Beta Access'
              ),
              _react2.default.createElement(
                'p',
                { className: 'modal-p' },
                'This is just a small preview of what the full platform will be. With intuitive collaboration, document tagging, and crowdsourced verification, Archer provides powerful investigative tools.'
              ),
              _react2.default.createElement(
                'p',
                { className: 'modal-p' },
                'If you\'d like to find out more, check out\xA0',
                _react2.default.createElement(
                  'a',
                  { href: 'https://archer.cloud/', className: 'underlined-link' },
                  'our website'
                ),
                '.'
              ),
              _react2.default.createElement(
                'p',
                { className: 'modal-p' },
                'Sign up to get early access to our beta!'
              ),
              _react2.default.createElement(_signUpForm2.default, null)
            )
          )
        )
      );
    }
  }]);

  return BetaModal;
}(_react.Component);

exports.default = BetaModal;