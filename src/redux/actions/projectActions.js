import {GET_PROJECTS, LOAD_PROJECT, TOGGLE_SIDEBAR, FETCH_TYPES} from "./actionTypes";

import * as server from "../../server";

/* =============================================================================================  */


function fetchTypesDispatch(type_list) {
    return {
        type: FETCH_TYPES,
        payload: type_list
    };
}

export function fetchTypes() { // first check if it's already in reducer
    return (dispatch, getState) => {
        let state = getState();
        if (state.project.entityTypes.length) {
            return state.project.entityTypes;
        } else {
            server.getTypes()
                .then((type_list) => {
                    dispatch(fetchTypesDispatch(type_list));
                })
                .catch((error) => console.log(error));
        }
    }
}

/* =============================================================================================  */

export function toggleSidebar() {
    return {
        type: TOGGLE_SIDEBAR
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

function getProjectsDispatch(projectList) {
    return {
        type: GET_PROJECTS,
        payload: projectList
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


