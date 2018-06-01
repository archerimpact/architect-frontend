import {
    USER_LOGIN,
	USER_LOGOUT,
	TOGGLE_SIDEBAR,
    STORE_PROJECT,
    STORE_ENTITY
  } from '../actions/actionTypes';

import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
		case TOGGLE_SIDEBAR:
			return {
				...state,
				sidebarVisible: !state.sidebarVisible
			};
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
        case USER_LOGIN:
            return {
                ...state,
                user: {
                    isAuthenticated: true
                }
            };
      case USER_LOGOUT:
    	// TODO: refuse to logout if do not receive success response
    	return {
    		...state,
    		user: {
    			isAuthenticated: false
    		}
    	};
		default:
			return state;
	}
}
