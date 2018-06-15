import {GET_PROJECTS, LOAD_PROJECT, TOGGLE_SIDEBAR, FETCH_TYPES} from "../actions/actionTypes";

const initialState = {
    sidebarVisible: true,
    projectList: [],
    currentProject: null,
    entityTypes: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarVisible: !state.sidebarVisible
            };
        case GET_PROJECTS:
            return {
                ...state,
                projectList: action.payload
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
        case FETCH_TYPES:
            return {
                ...state,
                entityTypes: action.payload
            };
        default:
            return state;
    }
}
