import {GET_PROJECTS, LOAD_PROJECT, TOGGLE_SIDEBAR} from "./actionTypes";

import * as server from "../../server";

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
        server.getProject(id)
        .then((data) => {
            let graphData;
            try {
                graphData = JSON.parse(data.message.data)
            }
            catch (err) {
                graphData = null
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
            dispatch(getProjectsDispatch(data.message));
        })
        .catch((err) => console.log(err.message));
    }
}


