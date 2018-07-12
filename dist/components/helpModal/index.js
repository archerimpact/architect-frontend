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

var HelpModal = function (_Component) {
  _inherits(HelpModal, _Component);

  function HelpModal() {
    _classCallCheck(this, HelpModal);

    return _possibleConstructorReturn(this, (HelpModal.__proto__ || Object.getPrototypeOf(HelpModal)).apply(this, arguments));
  }

  _createClass(HelpModal, [{
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
                'Graph usage'
              ),
              _react2.default.createElement(
                'table',
                null,
                _react2.default.createElement(
                  'tbody',
                  null,
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: 'rule' },
                      'Move node'
                    ),
                    _react2.default.createElement(
                      'td',
                      { className: 'hotkey' },
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'l-click'
                      ),
                      _react2.default.createElement(
                        'p',
                        null,
                        '\xA0',
                        '+',
                        '\xA0'
                      ),
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'drag'
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: 'rule' },
                      'Select nodes'
                    ),
                    _react2.default.createElement(
                      'td',
                      { className: 'hotkey' },
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'r-click'
                      ),
                      _react2.default.createElement(
                        'p',
                        null,
                        '\xA0',
                        '+',
                        '\xA0'
                      ),
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'drag'
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: 'rule' },
                      'Expand/(un)group node'
                    ),
                    _react2.default.createElement(
                      'td',
                      { className: 'hotkey' },
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'dbl-click'
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: 'rule' },
                      '(Un)fix selected nodes'
                    ),
                    _react2.default.createElement(
                      'td',
                      { className: 'hotkey' },
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'alt'
                      ),
                      _react2.default.createElement(
                        'p',
                        null,
                        '\xA0',
                        '+',
                        '\xA0'
                      ),
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'f'
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                      'td',
                      { className: 'rule' },
                      'Delete selected nodes'
                    ),
                    _react2.default.createElement(
                      'td',
                      { className: 'hotkey' },
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'del'
                      ),
                      _react2.default.createElement(
                        'p',
                        null,
                        '\xA0',
                        '/',
                        '\xA0'
                      ),
                      _react2.default.createElement(
                        'p',
                        { className: 'code' },
                        'r'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return HelpModal;
}(_react.Component);

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(HelpModal));