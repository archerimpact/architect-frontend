import { ADD_LINK, ADD_ENTITY, REMOVE_ENTITY, REMOVE_SUGGESTED_ENTITY, ADD_TAG, STORE_ENTITIES, STORE_SOURCES, STORE_PROJECTS, CURRENT_PROJECT, STORE_VERTICES} from '../actions/actionTypes';
import initialState from './initialState';

export default function (state = initialState, action) {
	switch(action.type) {
		case ADD_LINK:
			return {
				...state,
				savedLinks: {
					...state.savedLinks,
					status: 'isLoaded',
					links: state.savedLinks.links.concat(action.payload)
				}
			}
		case ADD_ENTITY:
			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: state.savedEntities.entities.concat(action.payload)
				},
				entityNames: state.entityNames.concat(action.payload.name)
			}
    case REMOVE_ENTITY:
      return {
        ...state,
        savedEntities: {
          ...state.savedEntities,
          status: 'isLoaded',
          entities: state.savedEntities.entities.filter(function(entity) {
            return (entity._id !== action.payload._id);
          })
        },
        entityNames: state.entityNames.concat(action.payload.name)        
      }
		case STORE_ENTITIES:
			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: action.payload
				},
				entityNames: action.payload.map((entity) => {return entity.name})
			}
		case STORE_SOURCES:
			return {
				...state,
				savedSources: {
					...state.savedSources,
					status: 'isLoaded',
					documents: action.payload
				},
			}				
		case ADD_TAG:
			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: action.payload
				},
      }
		case STORE_PROJECTS:
			return {
				...state,
				savedProjects: {
					...state.savedProjects,
					status: 'isLoaded',
					projects: action.payload
				}
			}
		case STORE_VERTICES:
			return {
				...state,
				savedVertices: {
					...state.savedVertices,
					status: 'isLoaded',
					vertices: action.payload
				}
			}
    case CURRENT_PROJECT:
      if (state.currentProject._id !== action.payload._id) {
        state.savedSources.status = 'isLoading';
        state.savedEntities.status = 'isLoading';
      }
      return {
        ...state,
        currentProject: action.payload
      }
		default:
			return state;
	}
}