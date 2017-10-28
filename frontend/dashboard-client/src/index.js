import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root/';
import registerServiceWorker from './registerServiceWorker';

const store = configureStore();
registerServiceWorker();

ReactDOM.render(
	<Root store={store} />,
 	document.getElementById('root')
);

