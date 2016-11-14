import React from 'react'
import {render} from 'react-dom';
import 'babel-polyfill';
import {Provider} from 'react-redux';
import './css/index.css'
import './css/simplemde.css'
let rootDocument=document.getElementById('app');
import {store} from './redux/store'
import RouterContent from './router'
render(
  <Provider store={store}>
    <RouterContent/>
  </Provider>
  ,rootDocument);
