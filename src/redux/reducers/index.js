import {persistCombineReducers} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import graph from './graphReducer';
import user from './userReducer';
import project from './projectReducer';

const config = {
  key: 'root',
  storage
};

config.debug = true;
const reducers = {
  graph,
  user,
  project
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;