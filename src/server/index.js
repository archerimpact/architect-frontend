import "whatwg-fetch";
import {configData} from "../config.js";
import axios from "axios";
import * as constants from "./settingsConstants.js";

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

    let url = configData.arch_url + '/?search=' + searchQuery;
    return new Promise(function (fulfill, reject) {
        axios.get(url, {
            params: {
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
            fulfill(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}
