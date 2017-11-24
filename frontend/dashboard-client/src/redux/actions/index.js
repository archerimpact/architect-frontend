import { ADD_LINK, USER_LOGOUT, ADD_ENTITY, ADD_TAG, ADD_ENTITIES, ADD_SOURCES, STORE_PROJECTS, STORE_VERTICES} from './actionTypes';
import * as server_utils from '../../server/utils';

export function addLink(link) {
	return {
		type: ADD_LINK,
		payload: link
	};
}

export function addEntity(entity) {
	return {
		type: ADD_ENTITY,
		payload: entity
	};
}

export function addEntities(entities){
	return {
		type: ADD_ENTITIES,
		payload: entities
	};
}

export function addSources(sources){
	return {
		type: ADD_SOURCES,
		payload: sources
	};
}

export function addTag(entities, name, tag) {
	let entity = entities.find(x => x.name === name)
	const index = entities.indexOf(entity)
	entities[index] = Object.assign({}, entities[index])
	entities[index].tags = entities[index].tags.concat([tag])	
	return {
		type: ADD_TAG,
		payload: entities
	};
}

export function deleteTag(entities, name, tag) {
	let entity = entities.find(x => x.name === name);
	const index = entities.indexOf(entity);
	entities[index] = Object.assign({}, entities[index]);
	
	const new_tags = entities[index].tags;
	const tagIndex = new_tags.find(x => x === name);
	entities[index].tags = entities[index].tags.splice().splice(tagIndex);

	return {
		type: ADD_TAG,
		payload: entities
	};
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

export function fetchVertices() {
	return function (dispatch, getState) {
		return server_utils.getVertexList()
			.then(vertices => {
				dispatch(storeVertices(vertices));
			})
			.catch(err => {
				console.log(err)
			});
	};
}

export function storeVertices(projects) {
	return {
		type: STORE_VERTICES,
		payload: projects
	};
}

export function logOutUser() {
	return {
		type: USER_LOGOUT,
	};
}