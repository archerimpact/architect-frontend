import {
    LOAD_DATA,
    RESET_GRAPH,
    STORE_CURRENT_NODE,
    STORE_ENTITY,
    STORE_SEARCH_RESULTS,
    UPDATE_GRAPH_DATA,
    TOGGLE_SIDEBAR
} from "../actions/actionTypes";

const initialState = {
    sidebarVisible: true,
    canvas: {
        searchData: []
    },
    entityCache: [],
    data: {
        nodes: [],
        links: []
    },
    currentNode: null
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
        case STORE_ENTITY:
            return {
                ...state,
                entityCache: action.payload.concat(state.entityCache)
            };
        default:
            return state;
    }
}
