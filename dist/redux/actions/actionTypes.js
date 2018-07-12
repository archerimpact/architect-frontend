"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


/* ============================ GRAPH ACTIONS ============================ */

var TOGGLE_SIDEBAR = exports.TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
var UPDATE_GRAPH_DATA = exports.UPDATE_GRAPH_DATA = "UPDATE_GRAPH_DATA";
var STORE_SEARCH_RESULTS = exports.STORE_SEARCH_RESULTS = "STORE_SEARCH_RESULTS";
var STORE_CURRENT_NODE = exports.STORE_CURRENT_NODE = "STORE_CURRENT_NODE";
var RESET_GRAPH = exports.RESET_GRAPH = "RESET_GRAPH";
var STORE_ENTITY = exports.STORE_ENTITY = "STORE_ENTITY";
var REORDER_ENTITY_CACHE = exports.REORDER_ENTITY_CACHE = "REORDER_ENTITY_CACHE";
var LOAD_DATA = exports.LOAD_DATA = "LOAD_DATA";

/* ============================ GRAPH SIDEBAR ACTIONS ============================ */

var SEARCH_DATA = exports.SEARCH_DATA = "SEARCH_DATA";
var ENTITY_SET = exports.ENTITY_SET = "ENTITY_SET";
var ENTITY_RESET = exports.ENTITY_RESET = "ENTITY_RESET";
var ENTITY_CACHE_RESORT = exports.ENTITY_CACHE_RESORT = "ENTITY_CACHE_RESORT";
var ENTITY_CACHE_ADD = exports.ENTITY_CACHE_ADD = "ENTITY_CACHE_ADD";

/* ============================ HOME ACTIONS ============================ */

var UPDATE_VIGNETTE = exports.UPDATE_VIGNETTE = "UPDATE_VIGNETTE";

/* ============================ OFFLINE ACTIONS ============================ */
// OFFLINE_ACTIONS MUST be set to false for production. Do not push to remote with this set to true.
var OFFLINE_ACTIONS = exports.OFFLINE_ACTIONS = false;