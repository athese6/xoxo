import React from "react";
import {
    Platform
} from 'react-native';
import {connect} from "react-redux";
import {View, Text, Image, StyleSheet} from 'react-primitives';
import debug from "debug";
import moment from "moment";
import {Crashlytics, Answers} from 'react-native-fabric';
import styles from "./default.styles";
import Box from "../styled-components";
import Config from 'react-native-config';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

@connect(store => {
    return {
        i18n: store.i18n,
        layout: store.layout,
        auth: store.auth
    };
})
export default class DefaultLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("loaded : DefaultLayout");
        console.log("Config.BUILD_MODE : " + Config.BUILD_MODE);
        const {dispatch} = this.props;
        Crashlytics.setUserName('Test Henry');
        Crashlytics.setString('Test', moment().format('MMMM Do YYYY, h:mm:ss a'));
        Answers.logCustom('Test_Answer_log', {time: "111a"});
        Answers.logSignUp('Test_Local', true);
    }

    componentDidUpdate() {
    }

    render() {
        // debug("load %s %s", Platform.OS, Platform.Version);
        console.log("load %s", Platform.OS, Platform.Version);
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    {"Welcome to React Native! : " + moment().format('MMMM Do YYYY, h:mm:ss a')}
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit App.js
                </Text>
                <Text style={styles.instructions}>
                    {instructions}
                </Text>
                <Box/>
            </View>
        );
    }
}

