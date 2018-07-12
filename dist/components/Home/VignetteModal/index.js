"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Graph = require("../../Canvas/Graph/");

var _Graph2 = _interopRequireDefault(_Graph);

var _GraphClass = require("../../Canvas/Graph/package/GraphClass");

var _GraphClass2 = _interopRequireDefault(_GraphClass);

var _server = require("../../../server/");

var server = _interopRequireWildcard(_server);

var _homeActions = require("../../../redux/actions/homeActions");

var homeActions = _interopRequireWildcard(_homeActions);

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _reactModalDialog = require("react-modal-dialog");

var _GraphPreview = require("../GraphPreview");

var _GraphPreview2 = _interopRequireDefault(_GraphPreview);

require("./style.css");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VignetteModal = function (_Component) {
  _inherits(VignetteModal, _Component);

  function VignetteModal(props) {
    _classCallCheck(this, VignetteModal);

    var _this = _possibleConstructorReturn(this, (VignetteModal.__proto__ || Object.getPrototypeOf(VignetteModal)).call(this, props));

    _this.onEntityClick = function (string) {
      // this.graph.flushData();
      var graph = _this.graph;
      server.searchBackendText(string).then(function (data) {
        var neo4j_id = data[0].id;
        _this.props.dispatch(homeActions.addToVignetteFromId(graph, neo4j_id, _this.props.index));
      }).catch(function (err) {
        console.log(err);
      });
    };

    _this.graph = new _GraphClass2.default();
    return _this;
  }

  _createClass(VignetteModal, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        "div",
        { onClick: this.props.handleClick },
        _react2.default.createElement(
          _reactModalDialog.ModalContainer,
          { onClose: this.props.handleClose },
          _react2.default.createElement(
            _reactModalDialog.ModalDialog,
            { onClose: this.props.handleClose },
            _react2.default.createElement(
              "div",
              { className: "vignette-card" },
              _react2.default.createElement(
                "div",
                { className: "vignette-card-row flex-row" },
                _react2.default.createElement(
                  "div",
                  { className: "vignette-card-col vignette-card-left-col" },
                  _react2.default.createElement(
                    "div",
                    { className: "vignette-card-header" },
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-date" },
                      "July 9, 2018"
                    ),
                    _react2.default.createElement(
                      "h4",
                      { className: "vignette-title" },
                      "How sanctions data applies to human rights"
                    ),
                    _react2.default.createElement("hr", { className: "vignette-divider" })
                  ),
                  _react2.default.createElement(
                    "div",
                    { className: "vignette-card-left-col-body" },
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "Click on the highlighted entities in this text to expand the nodes on the graph!"
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "Sanctions data often reveals information and connections about prominent alleged human rights violators.                     "
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "One example is ",
                      _react2.default.createElement(
                        "button",
                        { onClick: function onClick() {
                            _this2.onEntityClick("Dan Gertler");
                          } },
                        "Dan Gertler"
                      ),
                      ", sanctioned under the Global Magnitsky Executive Order of December 2017. For context, a US Treasury press release states that \u201CGertler is an international businessman and billionaire who has amassed his fortune through hundreds of millions of dollars\u2019 worth of opaque and corrupt mining and oil deals in the Democratic Republic of the Congo (DRC).\u201D                    "
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "On the graph, you can see Gertler\u2019s companies and associates that appear in the US Treasury SDN list. One company, ",
                      _react2.default.createElement(
                        "button",
                        { onClick: function onClick() {
                            _this2.onEntityClick("Fleurette Properties Limited");
                          } },
                        "Fleurette Holdings Limited"
                      ),
                      ", is a holding company the owns 14 other companies on the list."
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "You can also see Gertler\u2019s associate, ",
                      _react2.default.createElement(
                        "button",
                        { onClick: function onClick() {
                            _this2.onEntityClick("Pieter Albert Debouitte");
                          } },
                        "Pieter Albert Debouitte"
                      ),
                      ", who is connected to ",
                      _react2.default.createElement(
                        "button",
                        { onClick: function onClick() {
                            _this2.onEntityClick("Fleurette Properties Limited");
                          } },
                        "Fleurette Holdings Limited"
                      ),
                      " and the ",
                      _react2.default.createElement(
                        "button",
                        { onClick: function onClick() {
                            _this2.onEntityClick("Gertler Family Foundation");
                          } },
                        "Gertler Family Foundation"
                      ),
                      "."
                    )
                  )
                ),
                _react2.default.createElement(
                  "div",
                  { className: "vignette-card-col vignette-card-right-col" },
                  _react2.default.createElement(_GraphPreview2.default, { index: this.props.index, graph: this.graph })
                )
              )
            )
          )
        )
      );
    }
  }]);

  return VignetteModal;
}(_react.Component);

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

function mapStateToProps(state) {
  return {};
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(VignetteModal));