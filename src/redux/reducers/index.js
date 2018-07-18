import {persistCombineReducers} from "redux-persist";
import storage from "redux-persist/es/storage";
import graph from "./graphReducer";
import graphSidebar from "./graphSidebarReducer";
import user from "./userReducer";

const config = {
    key: 'root',
    storage
};

const reducers = {
    graph,
    graphSidebar,
    user
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;