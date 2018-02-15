import 'whatwg-fetch';
import { configData } from '../config.js';
import axios from 'axios';

/* Neo4j driver code not in use

import neo4j from "neo4j-driver/lib/browser/neo4j-web";
var neo4j = require('neo4j-driver').v1;

var driver = neo4j.driver("bolt://35.203.167.230:7474", neo4j.auth.basic('user','password'),
  {
  encrypted: 'ENCRYPTION_OFF'
  }
);*/

var qs = require('qs');

export function submitText(title, text, projectid) {
	var url ='http://localhost:8000/investigation/project/entityExtractor';
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


export function getSuggestedEntities(projectid) {
	/* Gets all entities related to a project. Server returns an object of objects containing all notes. */

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
}

function documentsToEntities(vertexes) {
    /* map over all notes, then map over all entities in each note, and build a new array entities 
       which contains all entities of all notes */
    var entities = vertexes.map((vertex) => {
      return vertex.source.document.entities.map((entity) => {
        return {"name": entity.normalized, "type": entity.type, "qid": entity.entityId, "sourceid": document._id}
      });
    });
    return [].concat.apply([], entities);
  }

export function getSource(sourceid) {
  /* Gets all entities related to a project. Server returns an object of objects containing all notes. */

  var url ='http://localhost:8000/investigation/source';

  let newEntities = null;
  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        sourceid: sourceid
      }
    })
    .then(function (documents) {
      newEntities = documentsToEntities(documents.data);
      fulfill({entities: newEntities, documents: documents.data})
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}

export function getProject(projectid) {
  var url ='http://localhost:8000/investigation/project';
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

  var url ='http://localhost:8000/investigation/project/entities';

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


//For if you only want project sources and not suggested entities,
//    currently not being used.
    
export function getProjectSources(projectid) {
  // Gets all entities related to a project. Server returns an object of objects containing all notes. 

  var url ='http://localhost:8000/investigation/project/sources';

  var url ='http://localhost:8000/investigation/project/sources';

  return new Promise(function(fulfill, reject) {
    axios.get(url, {
      params: {
        projectid: projectid
      }
    })
    .then(function (documents) {
      fulfill(documents.data);
    })
    .catch(function(error) {
      console.log(error);
    })
  });
}


export function addEntity(name, type, sources, project) {
    var url = 'http://localhost:8000/investigation/entity';
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
  var url = 'http://localhost:8000/investigation/entity';

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
  var url = 'http://localhost:8000/investigation/suggestedEntity';

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

export function addConnection(idOne, idTwo, description, project) {
    var url = 'http://localhost:8000/investigation/connection';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
            idOne: idOne,
            idTwo: idTwo,
            description: description,
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
          console.log('Error: could not add connection because: ' + err);
      });
    });
}

export function searchBackendText(searchQuery) {
  var url = 'http://35.197.34.74:9200/_search';
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
    /* retrieves the corresponding neo4j nodes of one id */

  var url = 'http://35.203.167.230:7474/db/data/cypher'
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
  /* retrieves the corresponding neo4j nodes of a list of ids */

  var url = 'http://35.203.167.230:7474/db/data/cypher'
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

export function getNodeRelationships(neo4j_id){
  var url = 'http://35.203.167.230:7474/db/data/cypher'
  var headers = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
  var data = {
  'query' : 'MATCH (node) WHERE id(node)={neo4j_id} MATCH (node)-[r]-(end) RETURN r, end',
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
