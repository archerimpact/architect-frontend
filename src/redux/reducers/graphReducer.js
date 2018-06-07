import {
    LOAD_PROJECT,
    RESET_GRAPH,
    STORE_CURRENT_NODE,
    STORE_ENTITY,
    STORE_SEARCH_RESULTS,
    UPDATE_GRAPH_DATA
} from "../actions/actionTypes";

export default function (state = {}, action) {
    switch (action.type) {
        case RESET_GRAPH:
            return {
                ...state,
                data: null,
                currentEntity: null,
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
        case STORE_ENTITY:
            return {
                ...state,
                currentEntity: action.payload
            };
        default:
            return state;
    }
}
