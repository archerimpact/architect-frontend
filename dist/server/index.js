"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.submitEmail = exports.getLink = exports.createLink = undefined;
exports.searchBackendText = searchBackendText;
exports.getNode = getNode;

require("whatwg-fetch");

var _config = require("../config.js");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _settingsConstants = require("./settingsConstants.js");

var constants = _interopRequireWildcard(_settingsConstants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var api_inst = _axios2.default.create({
    baseURL: _config.configData.backend_url,
    timeout: 1000
});

function searchBackendText(searchQuery) {
    /* Takes in a searchQuery parameter and sends a query directly to the hosted elastic
     search instance. Query format below is the standard for elastic. Matches only if the
     name field and the searchQuery are within an edit distance of 2.
       Query needs to be turned into a proper JSON to work.
       Returns data in the format:
     data = [data
     hits: {
     hits: {
     Array of 10 search results
     }
     }]
     */

    var url = _config.configData.arch_url + '/?search=' + searchQuery;
    return new Promise(function (fulfill, reject) {
        _axios2.default.get(url, {
            params: {
                source_content_type: 'application/json',
                size: 50
            }
        }).then(function (response) {
            fulfill(response.data.results);
        }).catch(function (error) {
            console.log(error);
        });
    });
}

function getNode(neo4j_id) {
    var degree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var useExclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var exclude = '';
    constants.EXPANSION_DEFAULT.exclude.forEach(function (type) {
        exclude += type + ',';
    });
    exclude = exclude.substring(0, exclude.length - 1);

    if (!useExclude) {
        exclude = '*';
    }

    var url = _config.configData.arch_url + ("/?id=" + neo4j_id + "&degrees=" + degree + "&expandby=*&exclude=" + exclude + "&attr=*&attrVal=*");

    return new Promise(function (fulfill, reject) {
        _axios2.default.get(url).then(function (response) {
            fulfill(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    });
}

var createLink = exports.createLink = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, author, description, data) {
        var stringifiedData, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        stringifiedData = JSON.stringify(data);
                        _context.next = 3;
                        return api_inst.post('/projects/create', {
                            name: name,
                            author: author,
                            description: description,
                            data: stringifiedData
                        });

                    case 3:
                        response = _context.sent;
                        return _context.abrupt("return", response.data);

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function createLink(_x3, _x4, _x5, _x6) {
        return _ref.apply(this, arguments);
    };
}();

var getLink = exports.getLink = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 3;
                        return api_inst.get('/projects/get', {
                            params: {
                                id: id
                            }
                        });

                    case 3:
                        response = _context2.sent;

                        return _context2.abrupt("return", response.data);

                    case 6:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function getLink(_x7) {
        return _ref2.apply(this, arguments);
    };
}();

var submitEmail = exports.submitEmail = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(email) {
        var response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return api_inst.get('/submit/email', {
                            params: {
                                email: email
                            }
                        });

                    case 2:
                        response = _context3.sent;

                        return _context3.abrupt("return", response);

                    case 5:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function submitEmail(_x8) {
        return _ref3.apply(this, arguments);
    };
}();