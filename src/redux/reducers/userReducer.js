import {
    USER_LOGIN,
    USER_LOGOUT,
} from '../actions/actionTypes';

const initialState = {
    isAuthenticated: false,
};

export default function (state = initialState, action) {
    switch(action.type) {
        case USER_LOGIN:
            return {
                ...state,
                isAuthenticated: true
            };
        case USER_LOGOUT:
            // TODO: refuse to logout if do not receive success response
            return {
                ...state,
                isAuthenticated: false
            };
        default:
            return state;
    }
}

// can imagine this reducer being used to modify username, hold information about enterprise vs not etc (see db schema
// and figure out what you need quick CRUD access to
