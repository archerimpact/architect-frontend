import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './redux/store/configureStore';
import Root from './App/Root/';
import registerServiceWorker from './registerServiceWorker';

const { persistor, store } = configureStore({})
registerServiceWorker();

ReactDOM.render(
	<Root store={store} persistor={persistor}/>,
 	document.getElementById('root')
);

