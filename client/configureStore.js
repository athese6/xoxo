/**
 * Created by Henry on 2017. 10. 14..
 */
import reducers from "./reducers";
import middlewares from "./middleware";
import {createStore} from "redux";

export default (state = {}, history) => {
    const store = createStore(
        reducers,
        state,
        middlewares(history)
    );

    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('./reducers').default
            store.replaceReducer(nextRootReducer)
        })
    }

    return store;
};
