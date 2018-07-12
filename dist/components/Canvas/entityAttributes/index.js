'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keys = [['registered_in', 'Registered In'], ['dateOfBirth', 'Date of Birth'], ['gender', 'Gender'], ['titles', 'Title'], ['place_of_birth', 'Place of Birth'], ['last_seen', 'Last Seen'], ['incorporation_date', 'Incorporation Date']];

exports.default = function (args) {
    var empty = true;
    var ret = _react2.default.createElement(
        'div',
        null,
        keys.filter(function (k) {
            return args.node[k[0]];
        }).map(function (k) {
            var n = args.node;
            var val = n[k[0]];
            empty = false;
            return _react2.default.createElement(
                'div',
                { className: 'info-row', key: k },
                _react2.default.createElement(
                    'p',
                    { className: 'info-key' },
                    k[1]
                ),
                !(val instanceof Array) ? _react2.default.createElement(
                    'p',
                    { className: 'info-value' },
                    val
                ) : _react2.default.createElement(
                    'ul',
                    { className: 'info-value-list' },
                    ' ',
                    val.map(function (v) {
                        return _react2.default.createElement(
                            'li',
                            { className: 'info-value' },
                            v
                        );
                    }),
                    ' '
                )
            );
        })
    );

    if (empty) {
        return null;
    } else {
        return ret;
    }
};