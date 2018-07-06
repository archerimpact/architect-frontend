import "whatwg-fetch";
import {configData} from "../config.js";
import axios from "axios";
import * as constants from "./settingsConstants.js";

let api_inst = axios.create({
    baseURL: configData.backend_url,
    timeout: 10000,
    headers: {},
    withCredentials: true
});

export async function getProjects() {
    const response = await api_inst.get('/projects/all');
    return response.data;
}

export async function getProject(id) {
    const response = await api_inst.get('/projects/get', {
        params: {
            projectid: id
        }
    });
    return response.data;
}

export async function createProject(title, description=null) {
  const response = await api_inst.post('/projects/create', {
    name: title,
    description: description,
    data: JSON.stringify({nodes: [], links: []})
  });
  return response.data;
}

export async function deleteProject(id) {
  const response = await api_inst.delete('/projects/delete', {
    params: {
      projectid: id
    }
  });
  return response.data;
}

export async function updateProject(data) {
    data.d3Data = JSON.stringify(data.d3Data);
    const response = await api_inst.put('/projects/update', {
        projectid: data.id,
        data: data.d3Data,
        img: data.image
    });
    return response.data;
}

export function searchBackendText(searchQuery) {
    /* Takes in a searchQuery parameter and sends a query directly to the hosted elastic
     search instance. Query format below is the standard for elastic. Matches only if the
     name field and the searchQuery are within an edit distance of 2.

     Query needs to be turned into a proper JSON to work.

     Returns data in the format:
     data = [data
     hits: {
     hits: {
     Array of 10 search results
     }
     }]
     */

    var url = configData.arch_url + '/?search=' + searchQuery;
    return new Promise(function (fulfill, reject) {
        axios.get(url, {
            params: {
                source_content_type: 'application/json'
            }
        })
        .then(function (response) {
            console.log("search results", response.data)
            fulfill(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getBackendNode(neo4j_id) {
    /* retrieves the corresponding neo4j nodes of one id

     returns data in the format:
     response.data= {
     data : [
     [neo4j_node]
     ]
     }
     */

    var url = configData.neo4j_url + '/db/data/cypher';
    var headers = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };
    var data = {
        "query": "MATCH (node) WHERE ID(node)={neo4j_id} RETURN node",
        params: {
            neo4j_id: parseInt(neo4j_id, 10)
        }
    };
    return new Promise(function (fulfill, reject) {
        axios.post(url, data, headers)
        .then(function (response) {
            fulfill(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getBackendNodes(neo4j_ids) {
    /* retrieves the corresponding neo4j nodes of a list of ids

     returns data in the format:
     response.data = {
     data: [
     [neo4j_node1],
     [neo4j_node2]
     ]
     }

     */

    var url = configData.neo4j_url + '/db/data/cypher';
    var headers = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };
    var data = {
        query: 'MATCH (node) WHERE ID(node) in {neo4j_ids} RETURN node',
        params: {
            neo4j_ids: neo4j_ids
        }
    };

    return new Promise(function (fulfill, reject) {
        axios.post(url, data, headers)
        .then(function (response) {
            fulfill(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getBackendRelationships(neo4j_id) {

    /* Retrieves all relationships of a neo4j node.
     neo4j returns items in this format:

     response.data = {
     data:
     [connection, startNode, endNode]
     }
     */

    var url = configData.neo4j_url + '/db/data/cypher';
    var headers = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };
    var data = {
        'query': 'MATCH (node) WHERE id(node)={neo4j_id} MATCH (node)-[r]-(end) RETURN r, node, end',
        'params': {
            'neo4j_id': parseInt(neo4j_id, 10)
        }
    };

    return new Promise(function (fulfill, reject) {
        axios.post(url, data, headers)
        .then(function (response) {
            fulfill(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getNode(neo4j_id, degree=0, useExclude=true) {
    let exclude = '';
    constants.EXPANSION_DEFAULT.exclude.forEach((type) => {
        exclude += type + ','
    })
    exclude = exclude.substring(0, exclude.length - 1);

    if (!useExclude) {
        exclude = '*';
    }

    let url = configData.arch_url + `/?id=${neo4j_id}&degrees=${degree}&expandby=*&exclude=${exclude}&attr=*&attrVal=*`;

    return new Promise(function (fulfill, reject) {
        axios.get(url)
        .then(function (response) {
            console.log("getting Node", response.data);
            fulfill(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getGraph(neo4j_id) {
    /* Retrieves the subgraph of a neo4j node two degrees away.
     Neo4j returns items in this format:
     response.data = {
     data:
     [
     [
     edge1,
     edge2,
     edge3
     ],
     [
     node1,
     node2,
     node3
     ],
     startNode
     ]
     }
     */

    var url = 'http://35.203.167.230:7474/db/data/cypher';
    var headers = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    };

    var data = {
        "query": "MATCH path=(g)-[r*0..5]-(p) WHERE id(g)={neo4j_id} UNWIND r as rel UNWIND nodes(path) as n RETURN COLLECT(distinct rel) AS collected, COLLECT(distinct n) as nodes, g",
        'params': {
            'neo4j_id': parseInt(neo4j_id, 10)
        }
    };

    return new Promise(function (fulfill, reject) {
        axios.post(url, data, headers)
        .then(function (response) {
            fulfill(response.data.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}
