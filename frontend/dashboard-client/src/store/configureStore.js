import { createStore, applyMiddleware } from 'redux';
//import { persistStore, autoRehydrate } from 'redux-persist';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers/rootReducer';

let middleware = [thunk];

const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
middleware = [...middleware, reduxImmutableStateInvariant, logger];

export default function configureStore(initialState) {
	return createStore(rootReducer, initialState, applyMiddleware(...middleware));
};