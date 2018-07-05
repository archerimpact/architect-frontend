import {GET_PROJECTS, LOAD_PROJECT} from "../actions/actionTypes";

const initialState = {
    project_list: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROJECTS:
            return {
                ...state,
                project_list: action.payload
            };
        case LOAD_PROJECT:
            return {
                ...state,
                currentProject: {
                    name: action.payload.name,
                    description: action.payload.description,
                    users: action.payload.users,
                    _id: action.payload._id,
                }
            };
        default:
            return state;
    }
}
