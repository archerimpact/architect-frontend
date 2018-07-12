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

var _graphActions = require('../../../redux/actions/graphActions');

var _reactLoadScript = require('react-load-script');

var _reactLoadScript2 = _interopRequireDefault(_reactLoadScript);

require('./style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PublishModal = function (_Component) {
  _inherits(PublishModal, _Component);

  function PublishModal(props) {
    var _this2 = this;

    _classCallCheck(this, PublishModal);

    var _this = _possibleConstructorReturn(this, (PublishModal.__proto__ || Object.getPrototypeOf(PublishModal)).call(this, props));

    _this.fetchLink = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(title, author, description, graph) {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _graphActions.saveLink)(title, author, description, graph);

              case 2:
                response = _context.sent;

                _this.setState({ link: response });

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.handleTitleChange = function (val) {
      _this.setState({ title: val });
    };

    _this.handleAuthorChange = function (val) {
      _this.setState({ author: val });
    };

    _this.handleDescriptionChange = function (val) {
      _this.setState({ description: val });
    };

    _this.renderLink = function () {
      if (_this.state.link === '') {
        return _react2.default.createElement('div', null);
      } else {
        return _react2.default.createElement(
          'div',
          { className: 'generated-link' },
          _react2.default.createElement(
            'p',
            null,
            'Feel free to tweet this out, or directly share this link:'
          ),
          _react2.default.createElement(
            'div',
            { className: 'flex-row share-row' },
            _react2.default.createElement('input', { value: "http://viz.archerimpact.com/" + _this.state.link, className: 'form-control', readOnly: true }),
            _react2.default.createElement(
              'a',
              { href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent((_this.state.title ? '"' + _this.state.title + '" - ' : '') + 'Check out my powerful interactive graph visualization of a sanctioned network on #ArcherViz @archerimpact https://viz.archerimpact.com/t/' + _this.state.link) },
              _react2.default.createElement('i', { id: 'tweet-link', className: 'twitter-action fab fa-twitter' })
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'link-warning' },
            _react2.default.createElement(
              'small',
              null,
              'To edit the text above, simply make your edits and generate a new link.'
            )
          ),
          _react2.default.createElement(
            'p',
            { className: 'link-warning mb-0' },
            _react2.default.createElement(
              'small',
              null,
              'Warning: This link will not be shown again, so make sure to copy it somewhere safe if you\'d like to keep it around!'
            )
          )
        );
      }
    };

    _this.state = {
      link: "",
      title: "",
      author: "",
      description: ""
    };
    return _this;
  }

  _createClass(PublishModal, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var graph = this.props.graph;
      var _state = this.state,
          title = _state.title,
          author = _state.author,
          description = _state.description;

      return _react2.default.createElement(
        'div',
        { onClick: this.props.handleClick },
        _react2.default.createElement(
          _reactModalDialog.ModalContainer,
          { onClose: this.props.handleClose },
          _react2.default.createElement(
            _reactModalDialog.ModalDialog,
            { onClose: this.props.handleClose },
            _react2.default.createElement(_reactLoadScript2.default, { url: 'https://platform.twitter.com/widgets.js' }),
            _react2.default.createElement(
              'div',
              { id: 'publish-modal' },
              _react2.default.createElement(
                'h4',
                { className: 'modal-title' },
                'Share this network'
              ),
              _react2.default.createElement(
                'p',
                { className: 'lead' },
                'Want to show off an interesting network you found? With ArcherViz, you can now share fully-interactive graphs via a link! Generate a link below that you can share on social media or send individually.'
              ),
              _react2.default.createElement(
                'form',
                null,
                _react2.default.createElement(
                  'div',
                  { className: 'form-row' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-group col' },
                    _react2.default.createElement(
                      'label',
                      { htmlFor: 'title-input' },
                      'Title'
                    ),
                    _react2.default.createElement('input', { className: 'form-control', id: 'title-input', placeholder: 'Title', value: title, onChange: function onChange(e) {
                        return _this3.handleTitleChange(e.target.value);
                      } })
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'form-group col' },
                    _react2.default.createElement(
                      'label',
                      { htmlFor: 'author-input' },
                      'Author'
                    ),
                    _react2.default.createElement('input', { className: 'form-control', id: 'author-input', placeholder: 'Your name', value: author, onChange: function onChange(e) {
                        return _this3.handleAuthorChange(e.target.value);
                      } })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'form-row' },
                  _react2.default.createElement(
                    'div',
                    { className: 'form-group' },
                    _react2.default.createElement(
                      'label',
                      { htmlFor: 'description-textarea' },
                      'Description'
                    ),
                    _react2.default.createElement('textarea', { className: 'form-control', id: 'description-textarea', value: description, onChange: function onChange(e) {
                        return _this3.handleDescriptionChange(e.target.value);
                      } })
                  )
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'form-row' },
                  _react2.default.createElement(
                    'div',
                    { id: 'publish-submit', className: 'btn btn-primary', onClick: function onClick() {
                        return _this3.fetchLink(title, author, description, graph);
                      } },
                    'Submit'
                  )
                )
              ),
              this.renderLink()
            )
          )
        )
      );
    }
  }]);

  return PublishModal;
}(_react.Component);

exports.default = PublishModal;