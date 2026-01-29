import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import userReducer from './reducers';

const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem('user'); // FIXED: 'user' not 'users'
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    return undefined;
  }
};

// Create store function
const configureStore = () => {
  return createStore(
    userReducer,
    loadPersistedState(),
    applyMiddleware(thunk)
  );
};

const store = configureStore();

// Persistence subscription - FIXED: Save entire state
store.subscribe(() => {
  const state = store.getState();
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('user', serializedState);
  } catch (e) {
    console.warn("State persistence failed:", e);
  }
});

export default store;