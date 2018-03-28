var nodes, links;
 
function createData(neo4j_id=null) {
  if (neo4j_id == null) {
    neo4j_id = 34192 //a default neo4j id with a good graph
  }
  getGraph(neo4j_id).then(data => {
    data = data[0] //because the neo4j data resides in data[0]

    function getidfromurl(neo4j_url){
      return parseInt(neo4j_url.split('/').pop()); //neo4j relationship stores the url to the nodes, id is in the last part of the url
    }
    var nodesData = data[1] 
    var neo4jtoindex = {}
    nodes = nodesData.map((node, i)=> {
      neo4jtoindex[parseInt(node.metadata.id)] = i //store a dictionary mapping neo4j_id to the index
      return {id: parseInt(node.metadata.id), type: node.metadata.labels[0], name: node.data.name}
    })
    links = data[0].map((edge)=> {
      //target and source have to reference the index of the node
      return {id: edge.metadata.id, type: edge.metadata.type, source: neo4jtoindex[getidfromurl(edge.start)], target: neo4jtoindex[getidfromurl(edge.end)]}
    })
    var data = {nodes: nodes, links: links}
    download(JSON.stringify(data), '34192.json', 'text/plain');
  }).catch((error)=> {console.log(error)})

  function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
  }

}