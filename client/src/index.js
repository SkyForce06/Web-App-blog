import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { reducers } from './reducers';
import App from './App';
import './index.css';

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <GoogleOAuthProvider clientId="907908769134-hfbb4086u0mbh5tlh9ebi8lcla6vne64.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
