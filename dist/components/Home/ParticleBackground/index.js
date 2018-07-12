"use strict";

Object.defineProperty(exports, "__esModule", {
      value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _reactLoadScript = require("react-load-script");

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParticleBackground = function (_Component) {
      _inherits(ParticleBackground, _Component);

      function ParticleBackground() {
            _classCallCheck(this, ParticleBackground);

            return _possibleConstructorReturn(this, (ParticleBackground.__proto__ || Object.getPrototypeOf(ParticleBackground)).apply(this, arguments));
      }

      _createClass(ParticleBackground, [{
            key: "render",
            value: function render() {
                  return _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement("div", { id: "particles-js" }),
                        _react2.default.createElement(_reactLoadScript2.default, { url: "./js/particles.min.js", onLoad: function onLoad() {
                                    return console.log('loaded particles');
                              } }),
                        _react2.default.createElement(_reactLoadScript2.default, { url: "./js/particles-instance.min.js", onLoad: function onLoad() {
                                    return console.log('loaded particle constants');
                              }, defer: "defer" })
                  );
            }
      }]);

      return ParticleBackground;
}(_react.Component);

exports.default = ParticleBackground;