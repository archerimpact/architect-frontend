import {
    SEARCH_DATA,
    RESET_GRAPH,
    UPDATE_GRAPH_DATA,
    LOAD_DATA,
    ENTITY_SET,
    ENTITY_RESET,
    ENTITY_CACHE_RESORT,
    ENTITY_CACHE_ADD
} from "../actions/actionTypes";

const initialState = {
    searchData: [],
    currentEntity: null,
    entityCache: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SEARCH_DATA:
            return {
                ...state,
                searchData: action.payload
            };
        case ENTITY_SET:
            return {
                ...state,
                currentEntity: action.payload
            };
        case ENTITY_RESET:
            return {
                ...state,
                currentEntity: false
            };
        case ENTITY_CACHE_RESORT:
            return {
                ...state,
                entityCache: action.payload
            };
        case ENTITY_CACHE_ADD:
            return {
                ...state,
                entityCache: action.payload.concat(state.entityCache)
            };
        default:
            return state;
    }
}
