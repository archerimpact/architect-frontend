import { ADD_LINK, ADD_ENTITY, ADD_TAG } from '../constants/actionTypes';
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
		case ADD_TAG:
			debugger
			console.log(state)
			const oldEntity = state.savedEntities.entities.find(x => x.name === action.payload.name1)
			console.log(state)
			const newEntity = Object.assign({}, oldEntity)
			newEntity.chips = action.payload.chips

			console.log(state)

			const newEntities = state.savedEntities.entities
			const index = newEntities.indexOf(oldEntity)

			return {
				...state,
				savedEntities: {
					...state.savedEntities,
					status: 'isLoaded',
					entities: newEntities.splice(index).concat(newEntity)
				}
			}
		default:
			return state;
	}
}