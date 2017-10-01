import { ADD_LINK } from '../constants/actionTypes';
import initialState from './initialState';

export default function (state = initialState, action) {
	debugger
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
		default:
			return state;
	}
}