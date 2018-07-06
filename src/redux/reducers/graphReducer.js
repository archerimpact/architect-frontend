import {
    LOAD_PROJECT,
    RESET_GRAPH,
    STORE_CURRENT_NODE,
    STORE_ENTITY,
    STORE_SEARCH_RESULTS,
    UPDATE_GRAPH_DATA,
    TOGGLE_SIDEBAR
} from "../actions/actionTypes";

const initialState = {
    canvas: {
        searchData: null
    },
    currentEntity: null,
    data: null,
    currentNode: null,
    sidebarVisible: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarVisible: !state.sidebarVisible
            };
        case RESET_GRAPH:
            return {
                ...state,
                data: null,
                // currentEntity: null,
                currentNode: null
            };
        case STORE_SEARCH_RESULTS:
            return {
                ...state,
                canvas: {
                    ...state.canvas,
                    searchData: action.payload
                }
            };
        case STORE_CURRENT_NODE:
            return {
                ...state,
                currentNode: {
                    id: action.payload
                }
            };
        case LOAD_PROJECT:
            return {
                ...state,
                data: action.payload.data
            };
        case UPDATE_GRAPH_DATA:
            return {
                ...state,
                data: action.payload.data
            };
        // case STORE_ENTITY:
        //     return {
        //         ...state,
        //         currentEntity: action.payload
        //     };
        default:
            return state;
    }
}
