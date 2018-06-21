import {GET_PROJECTS, LOAD_PROJECT, TOGGLE_SIDEBAR} from "./actionTypes";

import * as server from "../../server";
import * as d3 from "d3";

import offlineData from "../../data/well_connected_3.json";

/* =============================================================================================  */

export function toggleSidebar() {
    return {
        type: TOGGLE_SIDEBAR
    }
}

/* =============================================================================================  */

export function createProject(title, description=null) {
  return (dispatch) => {

    server.createProject(title, description)
      .then((data) => {
        dispatch(getProjects());
      })
      .catch((error) =>  console.log(error));
  }
}

/* =============================================================================================  */

export function deleteProject(id) {
  return (dispatch) => {
    server.deleteProject(id)
      .then((data) => {
        dispatch(getProjects());
      })
      .catch((error) =>  console.log(error));
  } 
}
/* =============================================================================================  */


function fetchProjectDispatch(project) {
    return {
        type: LOAD_PROJECT,
        payload: project
    };
}

export function fetchProject(id) {
    return (dispatch) => {
      let graphData;
                // d3.json(offlineData, function(json) {
                //     graphData = json;
                // });
        console.log(offlineData)
      offlineData.centerid = 18210;
      console.log('jEllo', offlineData)
      let proj = {image: null, id: id, data: offlineData, centerid: 18210};
      dispatch(fetchProjectDispatch(proj));

    }
    return (dispatch) => {
        server.getProject(id)
        .then((data) => {
            let graphData;
            try {

                graphData = JSON.parse(true ? data.data : data.message.data);
            }
            catch (err) {
                graphData = null;
            }
            let proj = {...data.message, data: graphData};

            dispatch(fetchProjectDispatch(proj));
        })
        .catch((error) => console.log(error));
    }
}

/* =============================================================================================  */

function getProjectsDispatch(project_list) {
    return {
        type: GET_PROJECTS,
        payload: project_list
    };
}

export function getProjects() {
    return (dispatch) => {
        server.getProjects()
        .then((data) => {
          return;
          let projects = data.message;
          projects.map((project, i) => {
            let graphData;
            try {
                graphData = JSON.parse(project.data)
            }
            catch (err) {
                graphData = null
            }
            projects[i] = {...projects[i], data: graphData};
            if (projects[i].img) {
              projects[i].preview_img = "data:image/svg+xml;charset=utf-8," + project.img;
            } else {
              projects[i].preview_img = "";
            }
          });
          dispatch(getProjectsDispatch(projects));
        })
        .catch((err) => console.log(err.message));
    }
}


