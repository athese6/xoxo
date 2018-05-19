import thunk from "redux-thunk";
import {createLogger} from "redux-logger";
import promise from "redux-promise-middleware";
import {applyMiddleware} from "redux";
import {routerMiddleware} from "react-router-redux";

export default history => {
  const routeMiddleware = routerMiddleware(history);
  const middleWares = [promise(), thunk, routeMiddleware];
  process.window && middleWares.push(createLogger());

  return applyMiddleware(...middleWares)
}
