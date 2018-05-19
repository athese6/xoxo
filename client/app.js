import React from "react";
// import device from "./device";
import {Provider} from "react-redux";
import {Router, Route, Switch, Redirect} from "react-router";
import {ThemeProvider} from "styled-components/src";
// import {ConnectedRouter} from "react-router-redux";
// import autobind from "autobind-decorator";
// import Async from "react-code-splitting";
import Default from "./src/default";
// const BodyHomeManage = () => <Async load={import('./app/body/home-manage')}/>;


const RouteNest = (props) => <Route exact={props.exact}
                                    path={props.path}
                                    render={p => <props.component {...p} children={props.children}/>}/>;

export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actualWidth: 1650,
            actualHeight: 0,
            settingWidth: 1650,
        };
        console.log(process.clientType)
    }

    render() {
        const {store, history, theme} = this.props;
        const state = store.getState();
        const {auth, i18n} = state;
        const isAdmin = auth.user.role && auth.user.role === "admin";
        const {locales} = i18n;
        const path = "";
        let newTheme = Object.assign({}, theme, this.state);
        return (
            <div>
                <ThemeProvider theme={newTheme}>
                    <Provider store={store}>
                        <Router history={history}>
                            <Route path="/" component={Default}>
                            </Route>
                        </Router>
                    </Provider>
                </ThemeProvider>
            </div>
        )
    }
}
