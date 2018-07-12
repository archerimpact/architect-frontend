'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _publishModal = require('../publishModal');

var _publishModal2 = _interopRequireDefault(_publishModal);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PreviewButton = function (_Component) {
  _inherits(PreviewButton, _Component);

  function PreviewButton(props) {
    _classCallCheck(this, PreviewButton);

    var _this = _possibleConstructorReturn(this, (PreviewButton.__proto__ || Object.getPrototypeOf(PreviewButton)).call(this, props));

    _this.toggleModal = function () {
      return _this.setState({ isModalOpen: !_this.state.isModalOpen });
    };

    _this.handleClick = function () {
      return _this.setState({ isModalOpen: true });
    };

    _this.handleClose = function () {
      return _this.setState({ isModalOpen: false });
    };

    _this.state = {
      isModalOpen: false
    };
    return _this;
  }

  _createClass(PreviewButton, [{
    key: 'render',
    value: function render() {
      var graph = this.props.graph;

      return _react2.default.createElement(
        'div',
        { className: 'btn btn-primary publish-button flex-row', onClick: this.toggleModal },
        _react2.default.createElement(
          'i',
          { className: 'material-icons' },
          'share'
        ),
        _react2.default.createElement(
          'p',
          { className: 'mb-0' },
          'Share!'
        ),
        this.state.isModalOpen && _react2.default.createElement(_publishModal2.default, { handleClick: this.handleClick, handleClose: this.handleClose, graph: graph })
      );
    }
  }]);

  return PreviewButton;
}(_react.Component);

exports.default = PreviewButton;