import {
    TOGGLE_SIDEBAR,
    STORE_PROJECT,
    STORE_ENTITY,
    GET_PROJECTS
} from '../actions/actionTypes';

const initialState = {
    sidebarVisible: true
};

export default function (state = initialState, action) {
    switch(action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarVisible: !state.sidebarVisible
            };
        case STORE_PROJECT:
            return {
                ...state,
                currentProject: {
                    name: action.payload.name,
                    description: action.payload.description,
                    users: action.payload.users,
                    _id: action.payload._id,
                    graphData: action.payload.data
                }
            };
        case STORE_ENTITY:
            return {
                ...state,
                currentEntity: action.payload
            };
        case GET_PROJECTS:
            return {
                ...state,
                project_list: action.payload
            };
        default:
            return state;
    }
}

// project_list and current_project
