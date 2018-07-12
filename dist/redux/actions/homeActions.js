"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addToVignetteFromId = addToVignetteFromId;

var _actionTypes = require("./actionTypes");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _server = require("../../server");

var server = _interopRequireWildcard(_server);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

function updateVignetteDispatch(data) {
    return {
        type: _actionTypes.UPDATE_VIGNETTE,
        payload: data
    };
}

function addToVignetteFromId(graph, id, index) {
    return function (dispatch, getState) {
        server.getNode(id, 1).then(function (data) {
            var state = getState();
            var allNodes = state.home.vignetteGraphData[index].nodes.concat(data.nodes);
            var allLinks = state.home.vignetteGraphData[index].links.concat(data.links);
            var dataNodes = _lodash2.default.uniqBy(allNodes, function (obj) {
                return obj.id;
            });
            var dataLinks = _lodash2.default.uniqBy(allLinks, function (obj) {
                return obj.id;
            });
            graph.addData(data.centerid, makeDeepCopy(dataNodes), makeDeepCopy(dataLinks));
            graph.update();
            graph.selectNode(id);
            var newVignetteData = state.home.vignetteGraphData;
            newVignetteData.splice(index, 1, { nodes: dataNodes, links: dataLinks });
            dispatch(updateVignetteDispatch(newVignetteData));
        }).catch(function (err) {
            console.log(err);
        });
    };
}