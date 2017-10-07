import { ADD_LINK, ADD_ENTITY } from '../constants/actionTypes';
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
					entities: state.savedEntities.entities.concat({name: action.payload.name, type: action.payload.type, link: action.payload.link})
				}
			}
		default:
			return state;
	}
}