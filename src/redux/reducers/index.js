import {persistCombineReducers} from "redux-persist";
import storage from "redux-persist/es/storage";
import graph from "./graphReducer";
import home from "./homeReducer";

const config = {
    key: 'root',
    storage
};

config.debug = true;
const reducers = {
    graph,
    home
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;