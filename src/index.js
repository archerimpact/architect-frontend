import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './redux/store/configureStore';
import Root from './App/Root/';
import registerServiceWorker from './registerServiceWorker';
import initialState from './redux/reducers/initialState';

const { persistor, store } = configureStore(initialState)
registerServiceWorker();

ReactDOM.render(
	<Root store={store} persistor={persistor}/>,
 	document.getElementById('root')
);

