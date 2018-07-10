import {
    UPDATE_VIGNETTE
} from "../actions/actionTypes";

const initialState = {
    vignetteGraphData: [
        {
            nodes: [],
            links: []
        },
        {
            nodes: [],
            links: []
        },
        {
            nodes: [],
            links: []
        },
        {
            nodes: [],
            links: []
        }
    ]
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_VIGNETTE:
            return {
                ...state,
                vignetteGraphData: action.payload
            };
        default:
            return state;
    }
}
