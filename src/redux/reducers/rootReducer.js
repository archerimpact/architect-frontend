import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import data from './dataReducer';
import graph from './graphReducer';
import user from './userReducer';
import project from './projectReducer';

const config = {
  key: 'root',
  storage
};

config.debug = true;
const reducers = {
    data,
    graph,
    user,
    project
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;