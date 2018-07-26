import {persistCombineReducers} from "redux-persist";
import storage from "redux-persist/es/storage";
import graph from "./graphReducer";
import home from "./homeReducer";
import graphSidebar from "./graphSidebarReducer"

const config = {
    key: 'root',
    storage,
    blacklist: ['graph', 'home', 'graphSidebar']
};

config.debug = false;
const reducers = {
    graph,
    graphSidebar,
    home
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;