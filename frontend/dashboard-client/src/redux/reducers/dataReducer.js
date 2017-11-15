import { ADD_LINK, ADD_ENTITY, REMOVE_SUGGESTED_ENTITY, ADD_TAG, STORE_ENTITIES, STORE_PENDING_ENTITIES, STORE_SOURCES, STORE_PROJECTS, CURRENT_PROJECT } from '../actions/actionTypes';
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
    case REMOVE_SUGGESTED_ENTITY:
      return {
        ...state,
        pendingEntities: {
          ...state.savedEntities,
          status: 'isLoaded',
          entities: state.pendingEntities.entities.filter(function(entity) {
            return (entity.name !== action.payload.entity.name || entity.sources[0] !== action.payload.entity.sources[0]);
          })
        },
        entityNames: state.entityNames.concat(action.payload.name)        
      }
    case STORE_PENDING_ENTITIES:
      return {
        ...state,
        pendingEntities: {
          ...state.pendingEntities,
          status: 'isLoaded',
          entities: action.payload.map((entity) => {return {name: entity.name, type: entity.type, link: '', tags: [], sources:[entity.sourceid], qid: entity.qid}})
        },
        entityNames: action.payload.map((entity) => {return entity.name})
      }
		case STORE_ENTITIES:
			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: action.payload.map((entity) => {return {name: entity.name, type: entity.type, link: '', tags: [], sources: entity.sources, qid: entity.qid}})
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
    case CURRENT_PROJECT:
      if (state.currentProject._id !== action.payload._id) {
        state.savedSources.status = 'isLoading';
        state.savedEntities.status = 'isLoading';
        state.pendingEntities.status = 'isLoading';
      }
      return {
        ...state,
        currentProject: action.payload
      }
		default:
			return state;
	}
}