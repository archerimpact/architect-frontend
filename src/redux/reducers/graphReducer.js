import {
    REORDER_ENTITY_CACHE,
    RESET_GRAPH,
    STORE_CURRENT_NODE,
    STORE_ENTITY,
    STORE_SEARCH_RESULTS,
    UPDATE_GRAPH_DATA,
    TOGGLE_SIDEBAR,
    LOAD_DATA,
    LOADING
} from "../actions/actionTypes";

const initialState = {
    sidebarVisible: true,
    canvas: {
        searchData: [],
        loading: null
    },
    data: {
        nodes: [],
        links: []
    },
    currentNode: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                canvas: {
                    ...state.canvas,
                    loading: action.payload
                }
            };
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebarVisible: !state.sidebarVisible
            };
        case RESET_GRAPH:
            return {
                ...state,
                data: {
                    nodes: [],
                    links: []
                },
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
        case UPDATE_GRAPH_DATA:
            return {
                ...state,
                data: {
                    nodes: action.payload.nodes,
                    links: action.payload.links
                }
            };
        case LOAD_DATA:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
}
