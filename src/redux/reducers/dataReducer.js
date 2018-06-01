import {
    STORE_PROJECT,
    STORE_ENTITY
  } from '../actions/actionTypes';

import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
		case STORE_PROJECT:
			return { 
				...state,
				currentProject: {
					name: action.payload.name,
					description: action.payload.description,
					users: action.payload.users,
					_id: action.payload._id,
					graphData: action.payload.data
				}
			};
		case STORE_ENTITY:
			return {
				...state,
				currentEntity: action.payload
			};
		default:
			return state;
	}
}
