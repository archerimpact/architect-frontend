import {UPDATE_VIGNETTE} from "./actionTypes";
import _ from 'lodash';

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

export function addToVignetteFromId(graph, id, index) {
    return (dispatch, getState) => {
        server.getNode(id, 1)
            .then(data => {
                let state = getState();
                let allNodes = state.home.vignetteGraphData[index].nodes.concat(data.nodes);
                let allLinks = state.home.vignetteGraphData[index].links.concat(data.links);
                let dataNodes = _.uniqBy(allNodes, (obj) => {return obj.id});
                let dataLinks = _.uniqBy(allLinks, (obj) => {return obj.id});
                graph.addData(data.centerid, makeDeepCopy(dataNodes), makeDeepCopy(dataLinks));
                graph.update();
                graph.selectNode(id);
                let newVignetteData = makeDeepCopy(state.home.vignetteGraphData);
                newVignetteData.splice(index, 1, {nodes: dataNodes, links: dataLinks})
                dispatch(updateVignetteDispatch(newVignetteData))
            })
            .catch(err => {
                console.log(err);
            });
    };
}

/* =============================================================================================  */

export function loadLink(projId) {
    return (dispatch, getState) => {
        server.getLink(projId)
            .then((res) => {
                let graphData;
                try {
                    graphData = JSON.parse(res.message.data);
                } catch (err) {
                    graphData = null;
                }
                let state = getState();
                let newVignettes = makeDeepCopy(state.home.vignetteGraphData);
                newVignettes[4] = {
                    nodes: graphData.nodes,
                    links: graphData.links,
                    name: res.message.name,
                    author: res.message.author,
                    description: res.message.description,
                    id: projId
                };
                dispatch(updateVignetteDispatch(newVignettes));
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

