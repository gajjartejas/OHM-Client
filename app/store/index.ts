import { createStore, compose, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSagaMiddleware from 'redux-saga';

import rootReducers from 'app/store/reducers'; // where reducers is a object of reducers
import sagas from 'app/store/sagas';

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['loadingReducer'],
  debug: true, //to get useful logging
};

const middleware = [];
const sagaMiddleware = createSagaMiddleware();

middleware.push(sagaMiddleware);

const reducers = persistCombineReducers(config, rootReducers);
const enhancers = [applyMiddleware(...middleware)];
const persistConfig: any = { enhancers };
const store = createStore(reducers, undefined, compose(...enhancers));
const persistor = persistStore(store, persistConfig, () => {
  console.log('State', store.getState());
});
const configureStore = () => {
  return { persistor, store };
};

sagaMiddleware.run(sagas);

export default configureStore;
