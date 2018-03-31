import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import * as server from '../../../../server/';

import './style.css'

var d3 = require("d3");

var force;
var svg;

const styles = {
  block: {
    maxWidth: 250,
  },
  checkbox: {
    marginBottom: 16,
    marginTop: 16,
    marginLeft:16
  },
};

class NodeGraph extends Component {
/* Takes as props a list of entities and a list of sources */

  constructor(props) {
    super(props);
    this.state = {
      text: true
    };
  }

  uniqueNodes(nodes) {
    var obj = {};

    for ( var i=0, len=nodes.length; i < len; i++ )
      obj[nodes[i]['_id']] = nodes[i];

    nodes = [];
    for ( var key in obj )
      nodes.push(obj[key]);
    return nodes;
  }

  /*
  createNodes(entities, documents) {
    //Takes in a list of entities and documents and maps it to a 
    //  list of nodes for the d3 simulation 
    var entityNodes = entities.map((entity) => {
      return {"id": entity.name, "name": entity.name, "type": entity.type};
    });
    var documentNodes = documents.map((document) => {
      return {"id": document._id, "name": document.name, "type": "DOCUMENT"};
    });
    return documentNodes.concat(this.uniqueNodes(entityNodes));
  };

  createLinks(entities, documents) {
    /* Iterates over all the entitiesa and documents and builds an 
      array of all the links for the d3 simulation 

    var documentLinks = [].concat.apply([], documents.map((document) => {
      return this.sourceToLinks(document);
    }));
    var entityLinks= [].concat.apply([], entities.map((entity) => {
      return this.connectionsToLinks(entity);
    }));
    if (typeof(documentLinks) === "undefined"){
      documentLinks=[];
    };
    if (typeof(entityLinks) === "undefined"){
      entityLinks=[];
    };
    return entityLinks.concat(documentLinks);
  };

  connectionsToLinks(vertex) {
    // Takes all of the tags of one entity and returns an array of all
    // the links of that one entity
    return vertex.connections.map((tag) => {
      return {"source": vertex.name, "target": tag};
    });
  };


    //TO-DO: refactor so that this method takes entities and maps a connection
    //to sources if and only if the source appears in this graph
  sourceToLinks(vertex) {
    if (vertex.length === 0) {
      return;
    }else{
      return vertex.source.document.entities.map((entity) => {
        return {"source": entity.normalized, "target": document._id};
      });
    }
  };
*/
  getNodeColor(node) {
    /* returns the color of the node based on the type of the entity */
    if (node.type.toLowerCase() === "person" || node.type === "Entity") {
      return "#FB7E81";
    }
    if (node.type === "ORGANIZATION") {
      return "#76C9E5";
    }
    if (node.type === "LOCATION" || node.type === "NATIONALITY") {
      return "#62A8BF";
    }
    if (node.type === "Source") {
      return "#49FFB7";
    }
    if (node.type === "Company" || node.type === "organization" || node.type==="corporation") {
      return "#97C2FC";
    }
    if (node.type === "Location" || node.type==="location") {
      return "#C454E5";
    }
    else {
      return "#FFFF02";
    }
  };

  getBorderColor(node){
    /* returns the color of the borderbased on the type of the entity */
    if (node.type.toLowerCase() === "person" || node.type === "Entity") {
      return "#FA0A11";
    }
    if (node.type === "Company" || node.type === "organization" || node.type==="corporation") {
      return "#2B7CE9";
    }
    else {
      return "#FFAE08";
    }
  };

  /* For getting an image for node types
  getImage(node) {
    if (node.type === "Person" || node.type === "PERSON") {
      return "https://www.materialui.co/materialIcons/social/person_grey_192x192.png";
    };
    if ( node.type === "DOCUMENT") {
      return "http://www.iconsdb.com/icons/preview/gray/document-xxl.png";
    };
    if (node.type ==="ORGANIZATION" || node.type === "Company") {
      return "https://maxcdn.icons8.com/Share/icon/dotty/Business//organization1600.png";
    };
    if (node.type === "Location" || node.type === "LOCATION") {
      return "https://d30y9cdsu7xlg0.cloudfront.net/png/12638-200.png";
    };
    if (node.type === "NATIONALITY") {
      return "https://cdn0.iconfinder.com/data/icons/buntu-trade/100/flag_glyph_convert-512.png";
    };
  } */

  getCollide(node) {
    if (node.type==="DOCUMENT") {
      return 60;
    }
    else {
      return 40;
    }
  }

loadGraph(neo4j_id=null, includeText, width=500, height=300) {
    /* The entire logic for generating a d3 forceSimulation graph */
    /*if (typeof(sources[0]) === "undefined") {
      sources = [];
    };*/
    if (neo4j_id == null) {
    neo4j_id = 34192 //a default neo4j id with a good graph
  }
  server.getGraph(neo4j_id).then(data => {
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
            this.setState({centerNode: d})
          }
          return d.id == neo4j_id
        })
        .classed("center", true);

      d3.selectAll("circle")
        .filter(function(d){ 
          console.log("d: ", d)
          console.log(d3.select(this))
          if (d.type == "Document") {
            console.log("type: ", d.type)
          }
          return d.type == "Document"
        })
        .classed("documentNode", true)
        .classed("centerNode", false)

      force.start();    

      link.classed("centerNode", function (o) {
        return o.source === this.state.centerNode || o.target === this.state.centerNode ? true : false; //highlight all connected links
      });
      node.classed("centerNode", function (o) {
        return neighboring (this.state.centerNode,o) ? true : false; //highligh connected nodes
      });          
    }

    function dragstart(d) {
      this.setState({currentlyselected: d}); //change the global variable for what's selected to d
      console.log("new selected: ", d)
      console.log("center node: ", this.state.centerNode)
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
        var newindex = node[0].length
        var newnode = {"index": newindex}

        if (this.state.currentlyselected !=null) {
          var newlink = {"source": newindex, "target": this.state.currentlyselected.index}
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
        if (this.state.currentlyselected == null) {
          return
        }
        nodes.splice(this.state.currentlyselected.index, 1);
        links.filter(function(l) {
          if( l.source.index !== this.state.currentlyselected.index && l.target.index !== this.state.currentlyselected.index) {
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
          if (x>=width) { //w is the global variable for width of the svg
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

    /* for zoom 
    function redraw() {
      svg.attr("transform", d3.event.transform);
    }
    */
  };

  updateGraph(nodes, links, text) {
    this.loadGraph(null, text, this.props.width, this.props.height);
  }

  componentWillReceiveProps(nextProps) {    
    /* When the props update (aka when there's a new entity or relationship), 
      delete the old graph and create a new one */

    this.updateGraph(nextProps.nodes, nextProps.links, this.state.text, this.props.width, this.props.height);
  };

  componentDidMount = () => {
    /* builds the first graph based on after the component mounted and mountPoint was created. */

    force = d3.layout.force()
                         .size([this.props.width, this.props.height])
                         .linkDistance([100])
                         .charge([-200]);
                         
    //var colors = d3.scale.category10();

    //Create SVG element
    svg = d3.select("#chart")
                .append("svg")
                .attr("width", this.props.width)
                .attr("height", this.props.height);

    this.setState({
      currentlyselected: null,
      centerNode: null,
      force: force,
      svg: svg
    })

    this.loadGraph(null, this.state.text, this.props.width, this.props.height);
  };

  updateCheck() {
    var newText = !this.state.text;
    this.setState({
      text: newText
    });
    this.updateGraph(this.props.nodes, this.props.links, newText);
  }

  render() {
    return (
      <div className="filled">
        <div style={{position:"absolute"}}>
          <Checkbox
            label="Include Text"
            checked={this.state.text}
            onClick={this.updateCheck.bind(this)}
            style={styles.checkbox}
          />
        </div>
        <div id="chart"></div>
      </div>
    );
  };
}

export default NodeGraph;