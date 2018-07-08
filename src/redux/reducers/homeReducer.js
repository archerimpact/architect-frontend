import {
    UPDATE_VIGNETTE
} from "../actions/actionTypes";

const initialState = {
    vignetteGraphData: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_VIGNETTE:
            return {
                ...state,
                vignetteGraphData: state.vignetteGraphData.concat(action.payload)
            };
        default:
            return state;
    }
}
