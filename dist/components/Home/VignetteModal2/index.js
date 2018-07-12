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

var VignetteModal2 = function (_Component) {
  _inherits(VignetteModal2, _Component);

  function VignetteModal2(props) {
    _classCallCheck(this, VignetteModal2);

    var _this = _possibleConstructorReturn(this, (VignetteModal2.__proto__ || Object.getPrototypeOf(VignetteModal2)).call(this, props));

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

  _createClass(VignetteModal2, [{
    key: "render",
    value: function render() {
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
                      "HOW sanctions data applies to corruption"
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-author" },
                      "Treasury Press Release"
                    ),
                    _react2.default.createElement("hr", { className: "vignette-divider" })
                  ),
                  _react2.default.createElement(
                    "div",
                    { className: "vignette-card-left-col-body" },
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "\"Oleg Deripaska is being designated pursuant to E.O. 13661 for having acted or purported to act for or on behalf of, directly or indirectly, a senior official of the Government of the Russian Federation, as well as pursuant to E.O. 13662 for operating in the energy sector of the Russian Federation economy.  Deripaska has said that he does not separate himself from the Russian state.  He has also acknowledged possessing a Russian diplomatic passport, and claims to have represented the Russian government in other countries.  Deripaska has been investigated for money laundering, and has been accused of threatening the lives of business rivals, illegally wiretapping a government official, and taking part in extortion and racketeering.  There are also allegations that Deripaska bribed a government official, ordered the murder of a businessman, and had links to a Russian organized crime group.\"                    "
                    ),
                    _react2.default.createElement(
                      "p",
                      { className: "vignette-content" },
                      "B-Finance Ltd., based in the British Virgin Islands, is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska.",
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "Basic Element Limited is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska.  Basic Element Limited is based in Jersey and is the private investment and management company for Deripaska\u2019s various business interests."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "EN+ Group is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska, B-Finance Ltd., and Basic Element Limited.  EN+ Group is located in Jersey and is a leading international vertically integrated aluminum and power producer."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "EuroSibEnergo is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and EN+ Group. EuroSibEnergo is one of the largest independent power companies in Russia, operating power plants across Russia and producing around nine percent of Russia\u2019s total electricity."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "United Company RUSAL PLC is being designated for being owned or controlled by, directly or indirectly, EN+ Group.  United Company RUSAL PLC is based in Jersey and is one of the world\u2019s largest aluminum producers, responsible for seven percent of global aluminum production."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "Russian Machines is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Basic Element Limited.  Russian Machines was established to manage the machinery assets of Basic Element Limited."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "GAZ Group is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Russian Machines.  GAZ Group is Russia\u2019s leading manufacturer of commercial vehicles."
                      ),
                      _react2.default.createElement(
                        "p",
                        { className: "vignette-content" },
                        "Agroholding Kuban, located in Russia, is being designated for being owned or controlled by, directly or indirectly, Oleg Deripaska and Basic Element Limited.                    "
                      )
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

  return VignetteModal2;
}(_react.Component);

function mapDispatchToProps(dispatch) {
  return {
    dispatch: dispatch
  };
}

function mapStateToProps(state) {
  return {};
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(VignetteModal2));