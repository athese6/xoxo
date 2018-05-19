import "./lib/materialize-src/sass/materialize.scss";
import "./lib/materialize-src/js/bin/materialize.js";
// import "./common-css/index.scss";
import "clientjs/dist/client.min";
import React from "react";
import ReactDOM from "react-dom";
import {App} from "./app.js";
// import GA from "./lib/googleAnalytics";
import configureStore from "./configureStore";
import theme from "./theme";
import {createBrowserHistory} from "history";
// import device from "./device";

// window.device = device;


const history = createBrowserHistory();
let store;
const render = App => {
    const element = document.getElementById("app-main");
    if (element) {
        const state = JSON.parse(store ? JSON.stringify(store.getState()) : element.getAttribute("data-state") || "{}");
        store = configureStore(state, history);
        element.removeAttribute("data-state");

        ReactDOM.render(<App store={store} history={history}
                             theme={theme}/>, element.childNodes[0] || element);
    }
};

$(document).ready(function () {
    // GA.init();
    // window.initDropDownFix();
    render(App);
    module.hot && module.hot.accept('./app', () => render(require('./app').App));
});


// import {AppRegistry} from 'react-native';
// import App from './App';
// import debug from "debug";
//
// console.log("load index.js");
// debug("load index.js");
// AppRegistry.registerComponent('XOXO', () => App);
