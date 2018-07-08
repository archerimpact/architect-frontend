import {UPDATE_VIGNETTE} from "./actionTypes";

import * as server from "../../server";

/* =========================================== HELPERS ==========================================  */

// Redux state cannot be mutated. Must create new copies of objects - function here ensures that
function makeDeepCopy(array) {
    let newArray = [];
    array.map((object) => {
        return newArray.push(Object.assign({}, object));
    });
    return newArray;
}

/* =============================================================================================  */

function updateVignetteDispatch(data) {
    return {
        type: UPDATE_VIGNETTE,
        payload: data
    };
}

export function addToVignetteFromId(graph, id) {
    return (dispatch) => {
        server.getNode(id, 1)
            .then(data => {
                graph.addData(0, makeDeepCopy(data.nodes), makeDeepCopy(data.links));
                graph.update();
                dispatch(updateVignetteDispatch(data));
            })
            .catch(err => {
                console.log(err);
            });
    };
}

