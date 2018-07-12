"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Footer = function (_Component) {
  _inherits(Footer, _Component);

  function Footer() {
    _classCallCheck(this, Footer);

    return _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).apply(this, arguments));
  }

  _createClass(Footer, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        "div",
        { className: "footer" },
        _react2.default.createElement(
          "div",
          { className: "container" },
          _react2.default.createElement(
            "div",
            { className: "footer-layout-container" },
            _react2.default.createElement("img", { className: "footer-logo", src: "full-footer.png" }),
            _react2.default.createElement(
              "div",
              { className: "social-media-links-container" },
              _react2.default.createElement(
                "a",
                { href: "https://twitter.com/archerimpact" },
                _react2.default.createElement("i", { className: "social-media-icon fab fa-twitter" })
              ),
              _react2.default.createElement(
                "a",
                { href: "https://medium.com/@archerimpact" },
                _react2.default.createElement("i", { className: "social-media-icon fab fa-medium-m" })
              ),
              _react2.default.createElement(
                "a",
                { href: "https://www.instagram.com/archerimpact/" },
                _react2.default.createElement("i", { className: "social-media-icon fab fa-instagram" })
              ),
              _react2.default.createElement(
                "a",
                { href: "https://www.facebook.com/archerimpact/" },
                _react2.default.createElement("i", { className: "social-media-icon fab fa-facebook-f" })
              ),
              _react2.default.createElement(
                "a",
                { href: "https://linkedin.com/company/archergroup/" },
                _react2.default.createElement("i", { className: "social-media-icon fab fa-linkedin-in" })
              ),
              _react2.default.createElement(
                "a",
                { href: "mailto:team@archerimpact.com" },
                _react2.default.createElement("i", { className: "social-media-icon far fa-envelope" })
              )
            )
          )
        )
      );
    }
  }]);

  return Footer;
}(_react.Component);

exports.default = Footer;