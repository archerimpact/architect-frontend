/* ============================ USER ACTIONS ============================ */

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';

/* ============================ PROJECT ACTIONS ============================ */

export const GET_PROJECTS = "GET_PROJECTS";
export const LOAD_PROJECT = "LOAD_PROJECT"; // Also triggers graph actions

/* ============================ GRAPH ACTIONS ============================ */

export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const UPDATE_GRAPH_DATA = "UPDATE_GRAPH_DATA";
export const STORE_SEARCH_RESULTS = "STORE_SEARCH_RESULTS";
export const STORE_CURRENT_NODE = "STORE_CURRENT_NODE";
export const RESET_GRAPH = "RESET_GRAPH";
export const STORE_ENTITY = "STORE_ENTITY";

/* ============================ OFFLINE ACTIONS ============================ */
// OFFLINE_ACTIONS MUST be set to false for production. Do not push to remote with this set to true.
export const OFFLINE_ACTIONS = false;
