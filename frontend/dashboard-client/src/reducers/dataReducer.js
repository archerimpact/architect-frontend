import { ADD_LINK } from '../constants/actionTypes';
import initialState from './initialState';
import {LOGGED_IN} from "../constants/actionTypes";

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
        case LOGGED_IN:
            return {
                ...state,
                isLoggedIn: false
            }

		default:
			return state;
	}
}