"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _VignetteModal = require("../VignetteModal3");

var _VignetteModal2 = _interopRequireDefault(_VignetteModal);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VignettePreview = function (_Component) {
  _inherits(VignettePreview, _Component);

  function VignettePreview(props) {
    _classCallCheck(this, VignettePreview);

    var _this = _possibleConstructorReturn(this, (VignettePreview.__proto__ || Object.getPrototypeOf(VignettePreview)).call(this, props));

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
      isModalOpen: false,
      colorProfile: props.colorProfile
    };
    return _this;
  }

  _createClass(VignettePreview, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "col-md" },
        _react2.default.createElement(
          "div",
          { className: "preview-title-content" },
          _react2.default.createElement(
            "div",
            { className: "flex-row" },
            _react2.default.createElement(
              "p",
              { className: "preview-date" },
              "July 9, 2018"
            )
          ),
          _react2.default.createElement(
            "h5",
            { className: "preview-title" },
            "How sanctions data applies to nuclear non-proliferation"
          ),
          _react2.default.createElement("hr", { className: "preview-divider" })
        ),
        _react2.default.createElement(
          "div",
          { className: "col-md preview-box" },
          _react2.default.createElement(
            "div",
            { className: "tint " + "tint-color-" + this.state.colorProfile, onClick: this.toggleModal },
            _react2.default.createElement(
              "p",
              { className: "preview-summary-text" },
              "View the network that violates human rights in south sudan."
            )
          ),
          _react2.default.createElement("img", { src: "./graph-test.png", className: "preview-image" })
        ),
        this.state.isModalOpen && _react2.default.createElement(_VignetteModal2.default, { handleClick: this.handleClick, handleClose: this.handleClose, index: this.props.index })
      );
    }
  }]);

  return VignettePreview;
}(_react.Component);

exports.default = VignettePreview;