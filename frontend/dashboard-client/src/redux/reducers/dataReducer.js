import {
  USER_LOGIN,
	USER_LOGOUT,
	TOGGLE_SIDEBAR,
		STORE_PROJECT,
		STORE_ENTITY
  } from '../actions/actionTypes';
import {
	INITIALIZE_CANVAS,
	UPDATE_GRAPH_DATA,
	RESET_PROJECT,
	STORE_SEARCH_RESULTS,
  STORE_CURRENT_NODE,
  UPDATE_PROJECT_DATA
} from '../../pages/Canvas/Graph/graphActions';

import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
		case INITIALIZE_CANVAS:
			return {
				...state,
				canvas: {
					graphData: null
				}, 
				currentNode: null,
				currentEntity: null,
				currentProject: null
			};
		case TOGGLE_SIDEBAR:
			return {
				...state,
				sidebarVisible: !state.sidebarVisible
			}
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
			}
		case RESET_PROJECT:
			return {
				...state,
				currentProject: null
			}
		case STORE_ENTITY:
			return {
				...state,
				currentEntity: action.payload
			}
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
      return {
        ...state,
        currentNode: {
          id: action.payload
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
    case UPDATE_PROJECT_DATA:
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          graphData: action.payload.data
        }
      };        
		default:
			return state;
	}
}
