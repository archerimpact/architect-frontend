import {
    LOAD_PROJECT,
    UPDATE_GRAPH_DATA,
    RESET_GRAPH,
    STORE_SEARCH_RESULTS,
    STORE_CURRENT_NODE,
    STORE_ENTITY
} from '../actions/actionTypes';

export default function (state = {}, action) {
    switch(action.type) {
        case RESET_GRAPH:
            return {
                ...state,
                data: null
            };
        case STORE_SEARCH_RESULTS:
            return {
                ...state,
                canvas: {
                    ...state.canvas,
                    searchData: action.payload
                }
            };
        case STORE_CURRENT_NODE: // active
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
                data: {
                    links: state.data.links.concat(action.payload.links),
                    nodes: state.data.nodes.concat(action.payload.nodes)
                }
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
