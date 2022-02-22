import { createStore, applyMiddleware } from "redux";
import RootReducer from "redux/reducer/rootReducer";
import logger from "redux-logger";
import thunk from "redux-thunk";

const store = createStore(RootReducer, applyMiddleware(thunk, logger));
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export default store;
