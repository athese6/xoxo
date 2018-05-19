import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";
import i18n from "./i18n";
import auth from "./auth";
import loc from "./loc";

export default combineReducers({
    i18n: i18n,
    auth: auth,
    loc: loc,
    routing: routerReducer,

})

