import {
    INITIALIZE_CANVAS,
    UPDATE_GRAPH_DATA,
    RESET_PROJECT,
    STORE_SEARCH_RESULTS,
    STORE_CURRENT_NODE,
    UPDATE_PROJECT_DATA
} from '../../pages/Canvas/Graph/graphActions';

export default function (state = {}, action) {
    switch(action.type) {
        case RESET_PROJECT: // active
            return {
                ...state,
                currentProject: {
                    ...state.currentProject,
                    graphData: null
                }
            };
        case UPDATE_GRAPH_DATA:
            return {
                ...state,
                canvas: {
                    ...state.canvas,
                    graphData: action.payload
                },
                currentProject: {
                    ...state.currentProject,
                    graphData: action.payload
                }
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
        case UPDATE_PROJECT_DATA:
            return {
                ...state,
                currentProject: {
                    ...state.currentProject,
                    graphData: action.payload.data
                }
            };
        default:
            return state;
    }
}
