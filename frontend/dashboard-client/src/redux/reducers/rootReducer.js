import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import data from './dataReducer';

const config = {
  key: 'root',
  storage
};

config.debug = true;
const reducers = {
  data
};

const reducer = persistCombineReducers(config, reducers);
export default reducer;