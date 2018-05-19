import React, {Component} from 'react';
import {
    Platform
} from 'react-native';
import {View, Text, Image, StyleSheet} from 'react-primitives';
import {Stack, Router, Scene, Actions} from 'react-native-router-flux';
import {connect, Provider} from 'react-redux';
import configureStore from "./configureStore";
import theme from "./theme";
import debug from "debug";
import moment from "moment";


import Landing from './src/default';
import {Answers, Crashlytics} from "react-native-fabric";
import Config from "react-native-config/index";
// import PageOne from './src/pageOne';
// import PageTwo from './src/pageTwo';
// import Home from './src/Home';
// import Search from './src/Search';

const store = configureStore();
const RouterWithRedux = connect()(Router);
console.ignoredYellowBox = ['Remote debugger'];


// const TabIcon = ({selected, title}) => {
//     return (
//         <Text style={{color: selected ? 'red' : 'black'}}>{title}</Text>
//     )
// };

const Scenes = Actions.create(
    <Scene key="root" hideNavBar hideTabBar>
        <Scene key="landing" component={Landing} title="Landing"/>
    </Scene>
);

export default class App extends Component {
    componentDidMount() {
        console.log("loaded : App");
        console.log("load %s", Platform.OS, Platform.Version);
        console.log("Config.BUILD_MODE : " + Config.BUILD_MODE);
    }

    render() {
        console.log("versionCode" + Config.ENV_VERSION_CODE);
        return (
            <Provider store={store}>
                <RouterWithRedux>
                    <Scene key="root" hideNavBar hideTabBar>
                        <Scene key="landing" component={Landing} title="Landing" initial={true}/>
                    </Scene>
                </RouterWithRedux>
            </Provider>
        );
    }
}

/*
<Scene key="pageTwo" component={PageTwo} title="PageTwo"/>
                        <Scene
                        key="rootTabBar"
                        tabs={true}
                        tabBarStyle={{backgroundColor: '#ffffff'}}>
                        <Scene key="home" component={Home} title="Home" icon={TabIcon} initial/>
                        <Scene key="search" component={Search} title="Search" icon={TabIcon}/>
                        </Scene>
 */
