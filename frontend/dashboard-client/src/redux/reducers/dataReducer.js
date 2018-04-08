import { 
  USER_LOGIN, 
  USER_LOGOUT,
  } from '../actions/actionTypes';

import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
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