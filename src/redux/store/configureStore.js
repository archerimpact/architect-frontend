import {applyMiddleware, createStore} from "redux";
import {persistStore} from "redux-persist";

import logger from "redux-logger";
import thunk from "redux-thunk";
import reducer from "../reducers";
import {composeWithDevTools} from "redux-devtools-extension";

let middleware = [thunk];

const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
middleware = [...middleware, reduxImmutableStateInvariant, logger];

export default function configureStore(initialState) {
    let store = createStore(reducer, undefined, composeWithDevTools(applyMiddleware(...middleware)))
    let persistor = persistStore(store)
    return {persistor, store}
};