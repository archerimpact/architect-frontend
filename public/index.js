import Graph from './js/GraphClass.js';
import * as sidebar from './js/sidebar.js' 
var $ = require("jquery");
var script = require("./js/sidebar.js");

window.openSidebar = script.openSidebar;

const graph = new Graph();

const height = $(window).height(),
  width = $(window).width();

d3.json("/data/well_connected_0.json", function(json) {
  graph.generateCanvas(width, height);
  graph.bindDisplayFunctions({node: sidebar.displayNodeInfo, group: sidebar.displayGroupInfo, link: sidebar.displayLinkInfo})
  graph.setData(18210, json.nodes, json.links, true);
});

