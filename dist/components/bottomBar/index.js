'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _signUpForm = require('../signUpForm');

var _signUpForm2 = _interopRequireDefault(_signUpForm);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BottomBar = function (_Component) {
  _inherits(BottomBar, _Component);

  function BottomBar(props) {
    _classCallCheck(this, BottomBar);

    var _this = _possibleConstructorReturn(this, (BottomBar.__proto__ || Object.getPrototypeOf(BottomBar)).call(this, props));

    _this.state = {
      hidden: false,
      submitted: false
    };
    _this.renderClose = _this.renderClose.bind(_this);
    return _this;
  }

  _createClass(BottomBar, [{
    key: 'renderClose',
    value: function renderClose() {
      var _this2 = this;

      return _react2.default.createElement(
        'i',
        { className: 'material-icons bottombar-close', onClick: function onClick() {
            return _this2.setState({ hidden: true });
          } },
        'close'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: "bottombar " + (this.state.hidden ? "d-none" : "") },
        !this.state.submitted ? _react2.default.createElement(
          'div',
          { className: 'bottombar-content' },
          this.renderClose(),
          _react2.default.createElement(
            'p',
            { className: 'bottombar-text' },
            'We\'re just getting started \u2014 this is only a sneak peek of our full platform! Subscribe to be notified of our future releases.'
          ),
          _react2.default.createElement(_signUpForm2.default, { naked: true })
        ) : _react2.default.createElement(
          'div',
          { className: 'bottombar-content' },
          this.renderClose(),
          _react2.default.createElement(
            'p',
            { className: 'bottombar-text' },
            'Thanks! For more info, check out\xA0',
            _react2.default.createElement(
              'a',
              { href: 'https://archer.cloud' },
              'our website'
            ),
            '.'
          )
        )
      );
    }
  }]);

  return BottomBar;
}(_react.Component);

exports.default = BottomBar;