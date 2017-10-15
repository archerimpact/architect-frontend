import { ADD_LINK, USER_LOGOUT} from '../constants/actionTypes';


export function addLink(link) {
	return {
		type: ADD_LINK,
		payload: link
	}
}

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

// export function logOutUser() {
// 	return {
// 		type: USER_LOGOUT,
// 	}
// }