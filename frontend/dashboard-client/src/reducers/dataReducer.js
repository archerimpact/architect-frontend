import { ADD_LINK, ADD_ENTITY, ADD_TAG, ADD_ENTITIES, ADD_SOURCES } from '../constants/actionTypes';
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
					entities: state.savedEntities.entities.concat({name: action.payload.name, type: action.payload.type, link: action.payload.link, chips:action.payload.chips})
				},
				entityNames: state.entityNames.concat(action.payload.name)
			}
		case ADD_ENTITIES:
			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: action.payload.map((entity) => {return {name: entity.name, type: entity.type, link: '', chips: [], sources:[entity.sourceid], qid: entity.qid}})
				},
				entityNames: action.payload.map((entity) => {return entity.name})
			}
		case ADD_SOURCES:
			return {
				...state,
				savedSources: {
					...state.savedSources,
					status: 'isLoaded',
					notes: action.payload
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
		default:
			return state;
	}
}