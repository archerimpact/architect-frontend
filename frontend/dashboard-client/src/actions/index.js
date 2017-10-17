import { ADD_LINK, USER_LOGOUT, ADD_ENTITY, ADD_TAG, ADD_ENTITIES} from '../constants/actionTypes';

export function addLink(link) {
	return {
		type: ADD_LINK,
		payload: link
	}
}

export function addEntity(entity) {
	return {
		type: ADD_ENTITY,
		payload: entity
	}
}

export function addEntities(entities){
	return {
		type: ADD_ENTITIES,
		payload: entities
	}
}

export function addTag(entities, name, tag) {
	let entity = entities.find(x => x.name === name)
	const index = entities.indexOf(entity)
	entities[index] = Object.assign({}, entities[index])
	entities[index].chips = entities[index].chips.concat([tag])	
	return {
		type: ADD_TAG,
		payload: entities
	}
}

export function deleteTag(entities, name, tag) {
	let entity = entities.find(x => x.name === name)
	const index = entities.indexOf(entity)
	entities[index] = Object.assign({}, entities[index])
	
	const new_chips = entities[index].chips
	const chipIndex = new_chips.find(x => x === name)
	entities[index].chips = entities[index].chips.splice().splice(chipIndex)

	return {
		type: ADD_TAG,
		payload: entities
	}
}

export function retrieveDetails(actionType, res) {
	return {
		type: actionType,
		payload: res
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

export function logOutUser() {
	return {
		type: USER_LOGOUT,
	}
}

export function apiCall(string) {
	var apiResponse = /* MAKE API CALL*/
	console.log(apiResponse)
	// make sure you're getting what you want. You should have an issue with promises..
} 