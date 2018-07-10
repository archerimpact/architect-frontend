import {
    UPDATE_VIGNETTE
} from "../actions/actionTypes";

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_VIGNETTE:
            return {
                ...state
            };
        default:
            return state;
    }
}
