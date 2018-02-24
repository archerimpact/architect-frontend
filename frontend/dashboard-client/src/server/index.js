import 'whatwg-fetch';
import { configData } from '../config.js';
import axios from 'axios';

var qs = require('qs');

export function submitText(title, text, projectid) {
	var url = configData.backend_url + '/investigation/project/entityExtractor';
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json' },
		body: JSON.stringify({
			'title': title,
			'text': text,
      'project': projectid
		})
	};
	return new Promise(function(fulfill, reject) {
		fetch(url, options)
		.then(res => {
			fulfill(res);
		})
		.catch(err => {
			reject('Error: could not add entity because: ' + err);
		});
	});
}

/*
export function getSuggestedEntities(projectid) {
	/* Gets all entities related to a project. Server returns an object of objects containing all notes. 

	var url ='http://localhost:8000/investigation/project/sources';

	let suggestedEntities = null;

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (documents) {
      suggestedEntities = documentsToEntities(documents.data);
      fulfill({entities: suggestedEntities, documents: documents.data})
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}*/

/*function documentsToEntities(vertexes) {
    /* map over all notes, then map over all entities in each note, and build a new array entities 
       which contains all entities of all notes 
       
    var entities = vertexes.map((vertex) => {
      return vertex.source.document.entities.map((entity) => {
        return {"name": entity.normalized, "type": entity.type, "qid": entity.entityId, "sourceid": document._id}
      });
    });
    return [].concat.apply([], entities);
  } */

export function getSource(sourceid) {
  /* Gets sources related to a project. Server returns an object of objects containing all notes. */

  var url = configData.backend_url + '/investigation/source';

  let newEntities = null;
  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        sourceid: sourceid
      }
    })
    .then(function (documents) {
      //newEntities = documentsToEntities(documents.data);
      fulfill({documents: documents.data})
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}


export function getProject(projectid) {
  var url = configData.backend_url + '/investigation/project';
  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (response) {
      fulfill(response.data)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}


export function getProjectEntities(projectid) {
  /* Gets all entities related to a project. Server returns an object of objects containing all notes. */

  var url = configData.backend_url + '/investigation/project/entities';

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(response => {
      var entities = Object.values(response.data)
      fulfill(entities)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}


/* For if you only want project sources and not suggested entities,
    currently not being used. */
    
export function getProjectSources(projectid) {
  // Gets all entities related to a project. Server returns an object of objects containing all notes. 

  var url = configData.backend_url + '/investigation/project/sources';

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (documents) {
      fulfill({documents: documents.data})
    })
    .catch(function(error) {
      console.log(error);
    })
  })
}

export function addEntity(name, type, sources, project) {
    var url = configData.backend_url + '/investigation/entity';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            name: name,
            type: type,
            sources: sources,
            project: project
        })
    };

    return new Promise(function(fulfill, reject) {
      fetch(url, options)
      .then(response => {
          // TODO: depending on the response, give user information about project add
          fulfill(response);
      })
      .catch(err => {
          console.log('Error: could not add entity because: ' + err);
      });
    });
}

export function deleteEntity(entity, projectid) {
  var url = configData.backend_url + '/investigation/entity';

  return new Promise(function(fulfill, reject) {
    axios.delete(url, {
      params: {
        entityid: entity._id,
        projectid: projectid
      }
    })
    .then(response => {
      fulfill(response)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}

export function deleteSuggestedEntity(suggestedEntity, sourceid) {
  var url = configData.backend_url + '/investigation/suggestedEntity';

  return new Promise(function(fulfill, reject) {
    axios.delete(url, {
      params: {
        name: suggestedEntity.name,
        sourceid: sourceid
      }
    })
    .then(response => {
      fulfill(response)
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}

export function addConnection(idOne, idTwo, description, projectid) {
    var url = configData.backend_url + '/investigation/connection';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            idOne: idOne,
            idTwo: idTwo,
            description: description,
            projectid: projectid
        })
    };
    return new Promise(function(fulfill, reject) {
      fetch(url, options)
      .then(response => {
          // TODO: depending on the response, give user information about project add
          fulfill(response);
      })
      .catch(err => {
          console.log('Error: could not add connection because: ' + err);
      });
    });
}

export function addGraph(projectid, entities, sources, connections) {
    var url = configData.backend_url + '/investigation/project/graph';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            projectid: projectid,
            entities: entities,
            sources: sources,
            connections: connections
        })
    };
    return new Promise(function(fulfill, reject) {
      fetch(url, options)
      .then(response => {
          // TODO: depending on the response, give user information about project add
          fulfill(response);
      })
      .catch(err => {
          console.log('Error: could not add connection because: ' + err);
      });
    });
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

  var url = configData.elastic_url + '/_search';
  var query = {
    query: {
      match: {
        "name": {
          query: searchQuery,
          fuzziness: 2
        }
      }
    }
  } 
  return new Promise(function(fulfill, reject) {
    axios.get(url, {
        params: {
        source: JSON.stringify(query),
        source_content_type: 'application/json'
      }
    })
    .then(function (response) {
      fulfill(response.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}

export function getBackendNode(neo4j_id){
    /* retrieves the corresponding neo4j nodes of one id 
      
        returns data in the format:
          response.data= {
            data : [
              [neo4j_node]
            ]
          }
    */

  var url = configData.neo4j_url + '/db/data/cypher'
  var headers = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  var data = {
    "query" : "MATCH (node) WHERE ID(node)={neo4j_id} RETURN node",
    params: {
      neo4j_id: parseInt(neo4j_id)
    }   
  }
  return new Promise(function(fulfill, reject) {
    axios.post(url, data, headers)
    .then(function (response) {
      fulfill(response.data.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  }); 
}

export function getBackendNodes(neo4j_ids){ 
  /* retrieves the corresponding neo4j nodes of a list of ids 

    returns data in the format:
      response.data = {
        data: [
          [neo4j_node1],
          [neo4j_node2]
        ]
      }

  */

  var url = configData.neo4j_url + '/db/data/cypher'
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
  }
  return new Promise(function(fulfill, reject) {
    axios.post(url, data, headers)
    .then(function (response) {
      fulfill(response.data.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  }); 
}

export function getBackendRelationships(neo4j_id){

  /* Retrieves all relationships of a neo4j node.
    neo4j returns items in this format: 

      response.data = {
        data:
          [connection, startNode, endNode] 
        }
  */

  var url = configData.neo4j_url + '/db/data/cypher'
  var headers = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  var data = {
  'query' : 'MATCH (node) WHERE id(node)={neo4j_id} MATCH (node)-[r]-(end) RETURN r, node, end',
    'params': {
      'neo4j_id': parseInt(neo4j_id)
    } 
  }
  return new Promise(function(fulfill, reject) {
    axios.post(url, data, headers)
    .then(function (response) {
      fulfill(response.data.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  }); 
}
