function getGraph(neo4j_id){
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

  var url = 'http://35.203.167.230:7474/db/data/cypher'
  var headers = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };

  var data = {
  "query" : "MATCH (g)-[r*0..6]-(p) WHERE id(g)={neo4j_id} UNWIND r as rel RETURN COLLECT(distinct rel) AS collected, COLLECT(distinct p) AS nodes, g",
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