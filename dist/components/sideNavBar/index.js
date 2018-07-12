'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

var _reactRedux = require('react-redux');

var _reactTooltip = require('react-tooltip');

var _reactTooltip2 = _interopRequireDefault(_reactTooltip);

var _BetaModal = require('../BetaModal');

var _BetaModal2 = _interopRequireDefault(_BetaModal);

var _helpModal = require('../helpModal');

var _helpModal2 = _interopRequireDefault(_helpModal);

var _graphActions = require('../../redux/actions/graphActions');

require('./style.css');

var _archerLogoA = require('../../images/archer-logo-a.png');

var _archerLogoA2 = _interopRequireDefault(_archerLogoA);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SideNavBar = function (_Component) {
  _inherits(SideNavBar, _Component);

  function SideNavBar(props) {
    _classCallCheck(this, SideNavBar);

    var _this = _possibleConstructorReturn(this, (SideNavBar.__proto__ || Object.getPrototypeOf(SideNavBar)).call(this, props));

    _this.handleClick = function (modalType) {
      return _this.setState(modalType ? { isHelpModalOpen: true } : { isBetaModalOpen: true });
    };

    _this.handleClose = function (modalType) {
      return _this.setState(modalType ? { isHelpModalOpen: false } : { isBetaModalOpen: false });
    };

    _this.toggleModal = function (modalType) {
      return _this.setState(modalType ? { isHelpModalOpen: !_this.state.isHelpModalOpen } : { isBetaModalOpen: !_this.state.isBetaModalOpen });
    };

    _this.state = {
      isBetaModalOpen: false,
      isHelpModalOpen: false
    };
    return _this;
  }

  _createClass(SideNavBar, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        { className: 'side-nav unselectable' },
        _react2.default.createElement(_reactTooltip2.default, { place: 'right', effect: 'solid' }),
        _react2.default.createElement(
          _reactRouterDom.Link,
          { to: '/', onClick: function onClick() {
              _this2.props.dispatch((0, _graphActions.resetGraphDispatch)());
            } },
          _react2.default.createElement(
            'div',
            { id: 'top-nav-button', className: 'side-nav-button' },
            _react2.default.createElement('img', { id: 'archer-a-icon', src: _archerLogoA2.default })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'side-nav-button', 'data-tip': 'Sign up', onClick: this.toggleBetaModal },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'person_add'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'side-nav-button', onClick: this.toggleModal, 'data-tip': 'Help' },
          _react2.default.createElement(
            'i',
            { className: 'material-icons' },
            'help'
          )
        ),
        this.state.isBetaModalOpen && _react2.default.createElement(_BetaModal2.default, { handleClick: this.handleClick, handleClose: this.handleClose }),
        this.state.isHelpModalOpen && _react2.default.createElement(_helpModal2.default, { handleClick: this.handleClick, handleClose: this.handleClose })
      );
    }
  }]);

  return SideNavBar;
}(_react.Component);

;

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapDispatchToProps)(SideNavBar));