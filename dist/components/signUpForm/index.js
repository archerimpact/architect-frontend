"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _graphActions = require("../../redux/actions/graphActions");

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUpForm = function (_Component) {
  _inherits(SignUpForm, _Component);

  function SignUpForm(props) {
    var _this2 = this;

    _classCallCheck(this, SignUpForm);

    var _this = _possibleConstructorReturn(this, (SignUpForm.__proto__ || Object.getPrototypeOf(SignUpForm)).call(this, props));

    _this.handleEmailChange = function (val) {
      _this.setState({ email: val });
    };

    _this.submitEmailToBackend = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _graphActions.submitEmail)(email);

              case 2:
                response = _context.sent;

                if (response.status === 200) {
                  _this.setState({ emailSubmitted: true });
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.render = function () {
      if (_this.state.emailSubmitted) {
        return _react2.default.createElement(
          "p",
          null,
          "Thanks!"
        );
      } else {
        var useClass = _this.props.naked ? "bottombar" : "sign-up";
        return _react2.default.createElement(
          "form",
          { className: useClass + "-form" },
          _react2.default.createElement("input", { className: useClass + "-input form-control", type: "email", placeholder: "Email address", onChange: function onChange(e) {
              return _this.handleEmailChange(e.target.value);
            } }),
          _react2.default.createElement(
            "div",
            { className: useClass + "-button btn btn-primary", onClick: function onClick() {
                return _this.submitEmailToBackend(_this.state.email);
              } },
            _this.props.naked ? _react2.default.createElement(
              "i",
              { className: "bottombar-submit material-icons" },
              "send"
            ) : _react2.default.createElement(
              "span",
              null,
              "Subscribe"
            )
          )
        );
      }
    };

    _this.state = {
      email: '',
      emailSubmitted: false
    };
    return _this;
  }

  return SignUpForm;
}(_react.Component);

exports.default = SignUpForm;