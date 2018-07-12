"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.toggleSidebar = toggleSidebar;
exports.createProject = createProject;
exports.deleteProject = deleteProject;
exports.fetchProject = fetchProject;
exports.getProjects = getProjects;

var _actionTypes = require("./actionTypes");

var _server = require("../../server");

var server = _interopRequireWildcard(_server);

var _well_connected_ = require("../../data/well_connected_3.json");

var _well_connected_2 = _interopRequireDefault(_well_connected_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* =============================================================================================  */

function toggleSidebar() {
  return {
    type: _actionTypes.TOGGLE_SIDEBAR
  };
}

/* =============================================================================================  */

function createProject(title) {
  var description = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  return function (dispatch) {
    server.createProject(title, description).then(function (data) {
      dispatch(getProjects());
    }).catch(function (error) {
      return console.log(error);
    });
  };
}

/* =============================================================================================  */

function deleteProject(id) {
  return function (dispatch) {
    server.deleteProject(id).then(function (data) {
      dispatch(getProjects());
    }).catch(function (error) {
      return console.log(error);
    });
  };
}
/* =============================================================================================  */

function fetchProjectDispatch(project) {
  return {
    type: _actionTypes.LOAD_PROJECT,
    payload: project
  };
}

function fetchProject(id) {
  return function (dispatch) {
    if (_actionTypes.OFFLINE_ACTIONS) {
      // TODO: determine best way to handle centerid
      _well_connected_2.default.centerid = 18210;
      var proj = { image: null, id: id, data: _well_connected_2.default, centerid: 18210 };
      dispatch(fetchProjectDispatch(proj));
    } else {
      server.getProject(id).then(function (data) {
        var graphData = void 0;
        try {
          graphData = JSON.parse(data.message.data);
        } catch (err) {
          graphData = null;
        }

        var proj = _extends({}, data.message, { data: graphData });
        dispatch(fetchProjectDispatch(proj));
      }).catch(function (error) {
        return console.log(error);
      });
    }
  };
}

/* =============================================================================================  */

function getProjectsDispatch(project_list) {
  return {
    type: _actionTypes.GET_PROJECTS,
    payload: project_list
  };
}

function getProjects() {
  return function (dispatch) {
    // TODO: figure out getProjects response format and create OFFLINE_ACTIONS equivalent
    // TODO: modifying projects inside map?
    server.getProjects().then(function (data) {
      var projects = data.message;
      projects.map(function (project, i) {
        var graphData = void 0;
        try {
          graphData = JSON.parse(project.data);
        } catch (err) {
          graphData = null;
        }

        projects[i] = _extends({}, projects[i], { data: graphData });
        if (projects[i].img) {
          projects[i].preview_img = "data:image/svg+xml;charset=utf-8," + project.img;
        } else {
          projects[i].preview_img = "";
        }
      });

      dispatch(getProjectsDispatch(projects));
    }).catch(function (err) {
      return console.log(err.message);
    });
  };
}