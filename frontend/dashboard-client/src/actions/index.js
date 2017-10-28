import { ADD_LINK, USER_LOGOUT, STORE_PROJECTS} from '../constants/actionTypes';
import * as server_utils from '../server/utils';

export function addLink(link) {
	return {
		type: ADD_LINK,
		payload: link
	};
}

// example of possible redux action creator and dispatch functions for server calls.

// export function retrieveDetails(actionType, res) {
// 	return {
// 		type: actionType,
// 		payload: res
// 	};
// }

// export function fetchData(endpoint, actionType) {
// 	return function (dispatch, getState) {
// 		return server[endpoint]()
// 			.then(response => {
// 				dispatch(retrieveDetails(actionType, response));
// 			})
// 			.catch(err => {
// 				console.log(err)
// 			})
// 	}
// }

export function fetchProjects() {
	return function (dispatch, getState) {
		return server_utils.getProjectList()
			.then(projects => {
				dispatch(storeProjects(projects));
			})
			.catch(err => {
				console.log(err)
			});
	};
}

export function storeProjects(projects) {
	return {
		type: STORE_PROJECTS,
		payload: projects
	};
}

export function logOutUser() {
	return {
		type: USER_LOGOUT,
	};
}