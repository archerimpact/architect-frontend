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

    var url = configData.elastic_url + '/_search';
    var query = {
        query: {
            match: {
                "name": {
                    query: searchQuery,
                    fuzziness: 2
                }
            }
        },
        size: 50,
    };
    return new Promise(function (fulfill, reject) {
        axios.get(url, {
            params: {
                source: JSON.stringify(query),
                source_content_type: 'application/json'
            }
        })
        .then(function (response) {
            fulfill(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export function getNode(neo4j_id, useExclude = true) {
    let exclude = '';
    constants.EXPANSION_DEFAULT.exclude.forEach((type) => {
        exclude += type + ','
    })
    exclude = exclude.substring(0, exclude.length - 1);

    if (!useExclude) {
        exclude = '*';
    }

    let url = `http://api.archer.cloud:2724/?id=${neo4j_id}&degrees=1&expandby=*&exclude=${exclude}&attr=*&attrVal=*`;

    return new Promise(function (fulfill, reject) {
        axios.get(url)
        .then(function (response) {
            fulfill(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}
