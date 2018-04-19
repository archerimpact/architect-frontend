import { 
  USER_LOGIN, 
  USER_LOGOUT,
  } from '../actions/actionTypes';
import {
	INITIALIZE_CANVAS,
	UPDATE_GRAPH_DATA,
	STORE_SEARCH_RESULTS,
  STORE_CURRENT_NODE
} from '../../pages/Canvas/Graph/graphActions';

import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
		case INITIALIZE_CANVAS:
			return {
				...state,
				canvas: {
					// graph: action.payload,
					graphData: null
				}
			};
		case UPDATE_GRAPH_DATA:
			return {
				...state,
				canvas: {
					...state.canvas,
					graphData: action.payload
				}
			};
		case STORE_SEARCH_RESULTS:
			return {
				...state,
				canvas: {
					...state.canvas,
					searchData: action.payload
				}
			};
    case STORE_CURRENT_NODE:
      debugger
      return {
        ...state,
        currentNode: {
          node: action.payload
        }
      }
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
	};
}