//Width and height
var w = 800;
var h = 600;

var currentlyselected = null; //global variable to hold the currentlyselected node
var centerNode = null; //global variable to hold the node the graph is centered around

var force = d3.layout.force()
                     .size([w, h])
                     .linkDistance([100])
                     .charge([-200]);
                     
//var colors = d3.scale.category10();

//Create SVG element
var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

loadGraph(34192); //default is neo4j node 34192 because it has a good graph

function loadGraphOnNode(neo4j_id) {
  /* handles the neo4j_id input */
  loadGraph(neo4j_id)
}

//loads the graph from a neo4j_id
function loadGraph(neo4j_id=null) {
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
    var nodes = nodesData.map((node, i)=> {
      neo4jtoindex[parseInt(node.metadata.id)] = i //store a dictionary mapping neo4j_id to the index
      return {id: parseInt(node.metadata.id), type: node.metadata.labels[0], name: node.data.name}
    })
    var links = data[0].map((edge)=> {
      //target and source have to reference the index of the node
      return {id: edge.metadata.id, type: edge.metadata.type, source: neo4jtoindex[getidfromurl(edge.start)], target: neo4jtoindex[getidfromurl(edge.end)]}
    })

    force
      .nodes(nodes)
      .links(links)


    //create selectors
    var link = svg.append("g").selectAll(".link")
    var node = svg.append("g").selectAll(".node")

    //updates nodes and links according to current data
    update()

    //Every time the simulation "ticks", this will be called
    force.on("tick", function() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
    });
    /*
    force.on("end", function() {
        console.log("resuming");
        
        force.resume(); // equivalent to force.alpha(.1);
    });*/

    function update(){

      var drag = force.drag().on("dragstart", dragstart); 

      link = link.data(links);

      //Access ENTER selection (hangs off UPDATE selection)
      //This represents newly added data that dont have DOM elements
      //so we create and add a "line" element for each of these data
      link
        .enter().append("line")
        .attr("class", "link")

      //Access EXIT selection (hangs off UPDATE selection)
      //This represents DOM elements for which there is now no corresponding data element
      //so we remove these from DOM
      link
          .exit().remove(); 

      node = node.data(nodes)
      node
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 15)
        .call(drag);

      node.exit().remove();

      d3.selectAll("circle")
        .filter(function(d){ 
          console.log("d: ", d)
          console.log(d3.select(this))
          if (d.id == neo4j_id) {
            console.log("d.id: ", d.id)
            centerNode = d
          }
          return d.id == neo4j_id
        })
        .classed("centerNode", true);

      force.start();    

      link.classed("centerNode", function (o) {
        return o.source === centerNode || o.target === centerNode ? true : false; //highlight all connected links
      });
      node.classed("centerNode", function (o) {
        return neighboring (centerNode,o) ? true : false; //highligh connected nodes
      });          
    }

    function dragstart(d) {
      currentlyselected = d; //change the global variable for what's selected to d
      console.log("new selected: ", d)
      console.log("center node: ", centerNode)
      node.classed("fixed", false); //deselect everything else
      d3.select(this).classed("fixed", true); //select what was just clicked on
      link.classed("fixed", function (o) {
        return o.source === d || o.target === d ? true : false; //highlight all connected links
      });
      node.classed("fixed", function (o) {
        return neighboring(d, o) ? true : false; //highligh connected nodes
      });      

    }
     
    function neighboring(a, b) {
    /* returns true if a and b are neighboring nodes */

      var linkedByIndex={}
      links.map((d) => {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
        linkedByIndex[d.target.index + "," + d.source.index] = 1;
      });
      return a.index == b.index ||  linkedByIndex[a.index + "," + b.index];
    }

    function createaddnode(){
      /* creates a new node with an index appropriate for the current amount of nodes
          new node is linked to the node that's currently selected; if nothing is currently selected
          and the currentlyselected global variable is null, the link won't initialize
       */
      window.addnode = function(){
        newindex = node[0].length
        newnode = {"index": newindex}

        if (currentlyselected !=null) {
          newlink = {"source": newindex, "target": currentlyselected.index}
          links.push(newlink)         
        }

        nodes.push(newnode)
       
        update()      
      }    
    }
    createaddnode();

    function createremoveselectednode(){
      /* removes the node that's currently selected */

      window.removeselectednode = function(){
        if (currentlyselected == null) {
          return
        }
        nodes.splice(currentlyselected.index, 1);
        links.filter(function(l) {
          if( l.source.index !== currentlyselected.index && l.target.index !== currentlyselected.index) {
            return;
          } else {
            links.splice(links.indexOf(l), 1) //important: changes the original array
          }
        });
        node.classed("fixed", false)
        link.classed("fixed", false)
        update();
      }
    }
    createremoveselectednode();

    function createpositionnodes(){
      /* positions all nodes into a grid */
      window.positionnodes = function(){
        var x = 100
        var y = 100;
        force.stop();
        node.each(function(d){
          d.fixed = true;
          d.x = x;
          x = x+ 100;
          if (x>=w) { //w is the global variable for width of the svg
            x = 100;
            y = y + 100;
          }
          d.y = y;
        }).transition().duration(1000).attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";     
        });
      
        link.transition().duration(1000)
        .attr("x1", function (d) {return d.source.x;})
        .attr("y1", function (d) {return d.source.y;})
        .attr("x2", function (d) {return d.target.x;})
        .attr("y2", function (d) {return d.target.y;});
      //setTimeout(function(){ force.start();},1000);
      }
    }
    createpositionnodes();

  }).catch((error)=>{console.log(error)})
}


//Initialize a default force layout, using the nodes and edges in dataset
/*d3.json("alice_data.json", function(error, json) {
  console.log(json)
  if (error) {console.log(error)}
  var nodes = json.nodes
  var links = json.links
  force.nodes(nodes)
    .links(links)


  //create selectors
  var link = svg.append("g").selectAll(".link")
  var node = svg.append("g").selectAll(".node")


  //Create nodes as circles
  update()

  //Every time the simulation "ticks", this will be called
  force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
           .attr("y1", function(d) { return d.source.y; })
           .attr("x2", function(d) { return d.target.x; })
           .attr("y2", function(d) { return d.target.y; });

     node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  });
  /*
  force.on("end", function() {
      console.log("resuming");
      
      force.resume(); // equivalent to force.alpha(.1);
  });

  function update(){



    link = link.data(links);

          //Access ENTER selection (hangs off UPDATE selection)
          //This represents newly added data that dont have DOM elements
          //so we create and add a "line" element for each of these data
          link
            .enter().append("line")
            .attr("class", "link")

          //Access EXIT selection (hangs off UPDATE selection)
          //This represents DOM elements for which there is now no corresponding data element
          //so we remove these from DOM
          link
              .exit().remove(); 

      var drag = force.drag().on("dragstart", dragstart); 

        node = node.data(nodes)
     node.
    enter().append("circle")
      .attr("class", "node")
      .attr("r", 15)
      .call(drag);

      node.exit().remove();

    force.start();           
  }

  function dragstart(d) {
    currentlyselected = d;
    console.log("new selected: ", d)
    node.classed("fixed", false)
    d3.select(this).classed("fixed", true);
    link.classed("fixed", function (o) {
              return o.source === d || o.target === d ? true : false;
          });
    node.classed("fixed", function (o) {
              return neighboring(d, o) ? true : false;
          });         
  }
   
  function neighboring(a, b) {
      var linkedByIndex={}
      links.map((d) => {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
        linkedByIndex[d.target.index + "," + d.source.index] = 1;
      });
      return a.index == b.index ||  linkedByIndex[a.index + "," + b.index];
  }

  function createaddnode(){
    window.addnode = function(){
      newindex = node[0].length
      newnode = {"index": newindex}
      newlink = {"source": newindex, "target": currentlyselected.index}
      
      links.push(newlink)
      nodes.push(newnode)
     
     update()      
    }    
  }
  createaddnode();

  function createremoveselectednode(){
    window.removeselectednode = function(){
      if (currentlyselected == null) {
        return
      }
      nodes.splice(currentlyselected.index, 1);
      links.filter(function(l) {
        if(l.source.index !== currentlyselected.index && l.target.index !== currentlyselected.index) {
          return;
        } else {
          links.splice(links.indexOf(l), 1)
        }
      });
      node.classed("fixed", false)
      update();
    }
  }
  createremoveselectednode();

  function createpositionnodes(){
      window.positionnodes = function(){
        var x = 100
        var y = 100;
         force.stop();
       node.each(function(d){
         d.fixed = true;
         d.x = x;
         x = x+ 100;
         if (x>=500) {
          x = 100;
          y = y + 100;
         }
         d.y = y;
       }).transition().duration(1000).attr("transform", function(d)
      {
      
      //console.log(d.hasRelationship);
      //console.log(d.y);
      return "translate(" + d.x + "," + d.y + ")"; 
      
      });
      
      link.transition().duration(1000).attr("x1", function (d) {
        
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
      //setTimeout(function(){ force.start();},1000);
      }
  }
  createpositionnodes();
})

*/
