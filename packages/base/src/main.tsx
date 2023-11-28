import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import store from './store';
import { RecoilRoot } from 'recoil';
import { initReactI18n } from './locale';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </RecoilRoot>
  </React.StrictMode>
);

initReactI18n();
