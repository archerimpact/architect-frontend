import { ADD_LINK, USER_LOGOUT, ADD_ENTITY, ADD_TAG, STORE_ENTITIES, STORE_PENDING_ENTITIES, STORE_SOURCES, STORE_PROJECTS, CURRENT_PROJECT} from './actionTypes';

import * as server_utils from '../../server/utils';
import * as server from '../../server';

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

export function storeEntities(entities){
	return {
		type: STORE_ENTITIES,
		payload: entities
	};
}

export function storePendingEntities(entities){
  return {
    type: STORE_PENDING_ENTITIES,
    payload: entities
  }
}

export function storeSources(sources){
	return {
		type: STORE_SOURCES,
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

export function getSource(sourceid) {
  return function (dispatch, getState) {
    return server.getSource(sourceid)
      .then(data => {
        dispatch(storePendingEntities(data.entities))
        dispatch(storeSources(data.documents))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export function getProjectEntities(projectid) {
  return function (dispatch, getState) {
    return server.getProjectEntities(projectid)
      .then(entities => {
        dispatch(storeEntities(entities))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export function getPendingEntities(projectid) {
  return function(dispatch, getState) {
    server.loadEntities(projectid)
      .then((data) => {
        dispatch(storePendingEntities(data.entities))
        //dispatch(storeSources(data.documents));
    }).catch((err) => console.log(err));
  }
}

export function getProjectSources(projectid) {
  return function (dispatch, getState) {
    return server.getProjectSources(projectid)
      .then(sources => {
        dispatch(storeSources(sources))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export function getProject(projectid) {
  return function(dispatch, getState) {
    return server.getProject(projectid)
      .then(project => {
        dispatch(setCurrentProject(project[0]))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export function setCurrentProject(project) {
  return{
    type: CURRENT_PROJECT,
    payload: project
  }
}

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