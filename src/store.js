import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { fromJS, Iterable } from 'immutable';

import { CHANGE_DOMAIN, SET_TOKENS_ALLOWED, GET_TOKENS_ALLOWED } from './actions/constants'
import createReducer from './reducers';
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware();

const stateTransformer = (state) => {
  if (Iterable.isIterable(state)) return state.toJS();
  return state;
};

const logger = createLogger({
  predicate: (getState, action) => action.type !== CHANGE_DOMAIN && action.type !== SET_TOKENS_ALLOWED && action.type !== GET_TOKENS_ALLOWED,
  collapsed: (getState, action, logEntry) => !logEntry.error,
  stateTransformer,
});


export default function configureStore(initialState = {}) {
  const middlewares = [
    sagaMiddleware,
    logger,
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  // store.runSaga = sagaMiddleware.run(rootSaga);
  sagaMiddleware.run(rootSaga);
  // store.injectedReducers = {}; // Reducer registry
  // store.injectedSagas = {}; // Saga registry

  // // Make reducers hot reloadable, see http://mxs.is/googmo
  // /* istanbul ignore next */
  // if (module.hot) {
  //   module.hot.accept('./reducers', () => {
  //     store.replaceReducer(createReducer(store.injectedReducers));
  //   });
  // }

  return store;
}