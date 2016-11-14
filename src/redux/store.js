/**
 * Created by yzsoft on 16/5/4.
 */
import  reducer from './reducers';
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk'
export  let store =createStore(
  reducer,
  applyMiddleware(thunk)
);
