import { 
  USER_LOGIN,
	USER_LOGOUT, 
	TOGGLE_SIDEBAR,
	STORE_PROJECT,
	STORE_ENTITY,
    GET_PROJECTS
  } from './actionTypes';

import { logoutAccount } from "../../server/auth_routes";
import * as server from '../../server';

export function userLogIn() {
  return {
    type: USER_LOGIN,
  };
}

export function userLogOutDispatch() {
	return {
		type: USER_LOGOUT,
	};
}

export function userLogOut() {
	return function (dispatch) {
		return logoutAccount()
			.then(res => {
				dispatch(userLogOutDispatch());
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export function toggleSidebar() {
	return {
		type: TOGGLE_SIDEBAR
	}
}

export function fetchProject(id) {
	return (dispatch) => {
		server.getProject(id)
			.then((data)=>{
				let graphData;
				try {
					graphData = JSON.parse(data.message.data)
				}
				catch (err) {
					graphData = null
				}
				let proj = {...data.message, data: graphData};

				dispatch(storeProject(proj));
			})
			.catch((error) =>  console.log(error));
	}
}

function storeProject(project) {
	return {
		type: STORE_PROJECT,
		payload: project
	};
}

export function fetchEntity(id) {
	return (dispatch) => {
		server.getNode(id)
		.then(data => {
			dispatch(storeEntity(data))
		})
		.catch(err => console.log(err))
	}
}

function storeEntity(entity) {
	return {
		type:	STORE_ENTITY,
		payload: entity
	}
}




export function getProjects() {
    console.log("we in here")
    return (dispatch) => {
        server.getProjects()
            .then((data)=> {
                console.log("wtfff")
                dispatch(getProjects(data.message));
            })
            .catch((err) =>  console.log("YOLOL WHADDUP"));
    }
}

getProjects = (project_list) => {
    return {
        type: GET_PROJECTS,
        payload: project_list
    };
};
