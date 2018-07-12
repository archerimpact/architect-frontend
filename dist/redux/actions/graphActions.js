"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.submitEmail = exports.saveLink = undefined;

/* =============================================================================================  */

var saveLink = exports.saveLink = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, author, description, graph) {
        var data, r;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        data = graph.fetchData();
                        _context.next = 3;
                        return server.createLink(name, author, description, data);

                    case 3:
                        r = _context.sent;
                        return _context.abrupt("return", r.message);

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function saveLink(_x2, _x3, _x4, _x5) {
        return _ref.apply(this, arguments);
    };
}();

/* =============================================================================================  */

var submitEmail = exports.submitEmail = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(email) {
        var response;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return server.submitEmail(email);

                    case 2:
                        response = _context2.sent;
                        return _context2.abrupt("return", response);

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function submitEmail(_x6) {
        return _ref2.apply(this, arguments);
    };
}();

exports.storeCurrentNodeDispatch = storeCurrentNodeDispatch;
exports.setCurrentNode = setCurrentNode;
exports.addToGraphFromId = addToGraphFromId;
exports.fetchSearchResults = fetchSearchResults;
exports.fetchEntity = fetchEntity;
exports.reorderEntityCache = reorderEntityCache;
exports.resetGraphDispatch = resetGraphDispatch;
exports.toggleSidebar = toggleSidebar;
exports.loadLink = loadLink;
exports.loadData = loadData;

var _actionTypes = require("./actionTypes");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require("../../server/index");

var server = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* =========================================== HELPERS ==========================================  */

// Redux state cannot be mutated. Must create new copies of objects - function here ensures that
function makeDeepCopy(array) {
    var newArray = [];
    array.map(function (object) {
        return newArray.push(Object.assign({}, object));
    });
    return newArray;
}

/* =============================================================================================  */

function storeCurrentNodeDispatch(id) {
    // MOVED
    return {
        type: _actionTypes.STORE_CURRENT_NODE,
        payload: id
    };
}

function setCurrentNode(d) {
    return function (dispatch) {
        if (_actionTypes.OFFLINE_ACTIONS) return;
        dispatch(storeCurrentNodeDispatch(d.id));
    };
}

/* =============================================================================================  */

function updateGraphDispatch(data) {
    return {
        type: _actionTypes.UPDATE_GRAPH_DATA,
        payload: data
    };
}

function addToGraphFromId(graph, id) {
    return function (dispatch, getState) {
        server.getNode(id, 1).then(function (data) {
            var state = getState();
            var allNodes = state.graph.data.nodes.concat(data.nodes);
            var allLinks = state.graph.data.links.concat(data.links);
            var dataNodes = _lodash2.default.uniqBy(allNodes, function (obj) {
                return obj.id;
            });
            var dataLinks = _lodash2.default.uniqBy(allLinks, function (obj) {
                return obj.id;
            });
            graph.addData(data.centerid, makeDeepCopy(dataNodes), makeDeepCopy(dataLinks));
            graph.update();
            dispatch(updateGraphDispatch({ nodes: dataNodes, links: dataLinks }));
        }).catch(function (err) {
            console.log(err);
        });
    };
}

/* =============================================================================================  */

function fetchSearchResultsDispatch(data) {
    // MOVED
    return {
        type: _actionTypes.STORE_SEARCH_RESULTS,
        payload: data
    };
}

function fetchSearchResults(query) {
    return function (dispatch) {
        if (_actionTypes.OFFLINE_ACTIONS) return;
        server.searchBackendText(query).then(function (data) {
            dispatch(fetchSearchResultsDispatch(data));
        }).catch(function (error) {
            return console.log(error);
        });
    };
}

/* =============================================================================================  */

function fetchEntityDispatch(entity) {
    // MOVED
    return {
        type: _actionTypes.STORE_ENTITY,
        payload: entity
    };
}

function fetchEntityDataFormatter(data) {
    // let nodes = data.nodes;
    // let linksLength = data.links.length;
    // for (let i=0; i < linksLength; i++) {
    //     // nodes[i]
    // }
    // we just need data to be node.id and then each possible link type or attr that matters "sanctioned on", etc here.
    //
    return [data];
}

function fetchEntity(id) {
    return function (dispatch) {
        if (_actionTypes.OFFLINE_ACTIONS) return;
        server.getNode(id, 1).then(function (data) {
            var formattedResponse = fetchEntityDataFormatter(data);
            dispatch(fetchEntityDispatch(formattedResponse));
        }).catch(function (err) {
            return console.log(err);
        });
    };
}

/* =============================================================================================  */

function reorderEntityCacheDispatch(newEntityCache) {
    // MOVED
    return {
        type: _actionTypes.REORDER_ENTITY_CACHE,
        payload: newEntityCache
    };
}

function move(arr, from, to) {
    var newArr = makeDeepCopy(arr);
    newArr.splice(to, 0, this.splice(from, 1)[0]);
    return newArr;
}

function reorderEntityCache(id) {
    var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    return function (dispatch, getState) {
        var state = getState();
        var entityCache = state.graph.entityCache;
        var newEntityCache = [];
        if (index) {
            newEntityCache = move(entityCache, index, 0);
            dispatch(reorderEntityCacheDispatch(newEntityCache));
        } else {
            for (var i = 0; i < entityCache.length; i++) {
                if (entityCache[i].id === id) {
                    newEntityCache = move(entityCache, i, 0);
                    break;
                }
            }
            if (newEntityCache.length !== 0) {
                dispatch(reorderEntityCacheDispatch(newEntityCache));
            }
        }
    };
}

/* =============================================================================================  */

function resetGraphDispatch() {
    return {
        type: _actionTypes.RESET_GRAPH
    };
}

/* =============================================================================================  */

function toggleSidebar() {
    return {
        type: _actionTypes.TOGGLE_SIDEBAR
    };
}function loadGraphDataDispatch(data) {
    return {
        type: _actionTypes.LOAD_DATA,
        payload: data
    };
}

function loadLink(projId) {
    return function (dispatch) {
        server.getLink(projId).then(function (res) {
            var graphData = void 0;
            try {
                graphData = JSON.parse(res.message.data);
            } catch (err) {
                graphData = null;
            }
            dispatch(loadGraphDataDispatch(graphData));
            return { name: res.message.name, author: res.message.author, description: res.message.description };
        }).catch(function (err) {
            console.log(err);
        });
    };
}

function loadData(data) {
    return function (dispatch) {
        dispatch(loadGraphDataDispatch(data));
    };
}