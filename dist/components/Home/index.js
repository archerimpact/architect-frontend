'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _VignettePreview = require('./VignettePreview');

var _VignettePreview2 = _interopRequireDefault(_VignettePreview);

var _VignettePreview3 = require('./VignettePreview2');

var _VignettePreview4 = _interopRequireDefault(_VignettePreview3);

var _VignettePreview5 = require('./VignettePreview3');

var _VignettePreview6 = _interopRequireDefault(_VignettePreview5);

var _GraphPreview = require('./GraphPreview');

var _GraphPreview2 = _interopRequireDefault(_GraphPreview);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _UnderlinedTextInput = require('./UnderlinedTextInput');

var _UnderlinedTextInput2 = _interopRequireDefault(_UnderlinedTextInput);

var _searchBar = require('../searchBar');

var _searchBar2 = _interopRequireDefault(_searchBar);

var _searchBarDatabase = require('../searchBarDatabase');

var _searchBarDatabase2 = _interopRequireDefault(_searchBarDatabase);

var _signUpForm = require('../signUpForm');

var _signUpForm2 = _interopRequireDefault(_signUpForm);

require('./style.css');

require('../../App/montserrat.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_Component) {
  _inherits(Home, _Component);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
  }

  _createClass(Home, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: 'beta-section' },
          _react2.default.createElement(
            'div',
            { className: 'container' },
            _react2.default.createElement(
              'div',
              { className: 'sign-up-row flex-row' },
              _react2.default.createElement(
                'p',
                { className: 'sign-up-tagline' },
                'This is just a teaser. Stay tuned for more.'
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { id: 'top' },
          _react2.default.createElement(
            'header',
            { className: 'main-header' },
            _react2.default.createElement(
              'nav',
              { className: 'primary' },
              _react2.default.createElement(
                'ul',
                { id: 'primary-navigation' },
                _react2.default.createElement('li', { className: 'menu-item' })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'logo-header center-column' },
              _react2.default.createElement(
                'span',
                { className: 'centered-image' },
                _react2.default.createElement(
                  'a',
                  { href: '/' },
                  _react2.default.createElement('img', { className: 'logo-image', src: 'logo.png', alt: '' })
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'search-holder' },
                _react2.default.createElement(_searchBarDatabase2.default, { homeSearchContainerId: 'home-search-container', homeSearchInputId: 'home-search-input', showSettings: false })
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'home-item' },
          _react2.default.createElement(
            'div',
            { className: 'content-section treasury-release' },
            _react2.default.createElement(
              'div',
              { className: 'container' },
              _react2.default.createElement(
                'div',
                { className: 'content-title-section' },
                _react2.default.createElement(
                  'div',
                  { className: 'content-title-text' },
                  'The Latest'
                ),
                _react2.default.createElement('hr', { className: 'content-title-underline' })
              ),
              _react2.default.createElement(
                'div',
                { className: 'content-preview-section' },
                _react2.default.createElement(
                  'div',
                  { className: 'release-preview-card' },
                  _react2.default.createElement(
                    'div',
                    { className: 'row' },
                    _react2.default.createElement(
                      'div',
                      { className: 'col-md-6' },
                      _react2.default.createElement(_GraphPreview2.default, { index: 3 })
                    ),
                    _react2.default.createElement(
                      'div',
                      { className: 'col-md-6 release-preview-content' },
                      _react2.default.createElement(
                        'div',
                        { className: 'release-preview-summary' },
                        _react2.default.createElement(
                          'p',
                          null,
                          'Earlier this year, Archer designed & developed ',
                          _react2.default.createElement(
                            'a',
                            { href: 'https://sanctionsexplorer.org/' },
                            'SanctionsExplorer'
                          ),
                          ', releasing it in April in partnership with C4ADS.  Now, the Archer team has gone one step further,  re-envisioning how our users interact with and derive insight from sanctions data.'
                        ),
                        _react2.default.createElement(
                          'p',
                          { className: 'bold' },
                          'Welcome to ArcherViz, a bite-sized preview of a powerful investigative platform.'
                        ),
                        _react2.default.createElement(
                          'p',
                          { id: 'sign-up' },
                          'ArcherViz applies our powerful investigative tool to the OFAC SDN list.  With over 3,000 official entity relationships, this data begs to be interacted with in a graph format. Experience a new way to investigate and share how your favorite sanctioned individuals, companies, and vessels are connected.'
                        )
                      ),
                      _react2.default.createElement(
                        'div',
                        { className: 'sign-up-container', id: 'subscribe' },
                        _react2.default.createElement(
                          'h4',
                          null,
                          'There\'s more coming soon!'
                        ),
                        _react2.default.createElement(
                          'p',
                          null,
                          'This is just a preview of how powerful graph visualization can be applied to critical datasets.  Sign up to receive early access to our full beta release when it\'s ready.'
                        ),
                        _react2.default.createElement(_signUpForm2.default, null)
                      )
                    )
                  )
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'content-section' },
            _react2.default.createElement(
              'div',
              { className: 'container' },
              _react2.default.createElement(
                'div',
                { className: 'content-title-text' },
                'Case Studies'
              ),
              _react2.default.createElement('hr', { className: 'content-title-underline' }),
              _react2.default.createElement(
                'p',
                { className: 'content-title-summary lead' },
                'Graph visualization can be a powerful tool for creating compelling narratives and conveying complex relationships.  Explore our featured case studies which illustrate the experience of supplementing text with a fully-interactive graph.'
              ),
              _react2.default.createElement(
                'div',
                { className: 'row' },
                _react2.default.createElement(_VignettePreview2.default, { key: "vp1", index: 0, colorProfile: '0' }),
                _react2.default.createElement(_VignettePreview4.default, { key: "vp2", index: 1, colorProfile: '1' }),
                _react2.default.createElement(_VignettePreview6.default, { key: "vp3", index: 2, colorProfile: '2' })
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'content-section', id: 'find-out-more-section' },
            _react2.default.createElement(
              'div',
              { className: 'container', id: 'find-out-container' },
              _react2.default.createElement(
                'div',
                { className: 'content-title-text text-center' },
                'Just the beginning.'
              ),
              _react2.default.createElement(
                'div',
                { className: 'find-out-more-row flex-row' },
                _react2.default.createElement(
                  'i',
                  { className: 'beginning-icon material-icons' },
                  'date_range'
                ),
                _react2.default.createElement(
                  'div',
                  null,
                  _react2.default.createElement(
                    'p',
                    { className: 'content-title-summary lead' },
                    'The summer is in full swing and so are we.  We have an exciting set of releases slated for the next few weeks.  Don\'t want to miss out?  Catch us on ',
                    _react2.default.createElement(
                      'a',
                      { href: 'https://twitter.com/archerimpact', className: 'real-link bold' },
                      'Twitter'
                    ),
                    ' or ',
                    _react2.default.createElement(
                      'a',
                      { href: '#sign-up', className: 'real-link bold' },
                      'subscribe'
                    ),
                    ' to our summer announcements. To learn more about what we do, check out our ',
                    _react2.default.createElement(
                      'a',
                      { href: 'http://archer.cloud/', className: 'real-link bold' },
                      ' website'
                    ),
                    '.'
                  )
                )
              )
            )
          )
        ),
        _react2.default.createElement(_Footer2.default, null)
      );
    }
  }]);

  return Home;
}(_react.Component);

exports.default = Home;