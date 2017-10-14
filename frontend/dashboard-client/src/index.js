import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const store = configureStore();
registerServiceWorker();

const Index = () => (
  <MuiThemeProvider>
    <Root store={store} />
  </MuiThemeProvider>
)

ReactDOM.render(<Index />, document.getElementById('root'));