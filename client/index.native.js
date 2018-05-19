import {AppRegistry, Platform} from 'react-native';
import App from './app.native';
import debug from "debug";

// console.log("load11 %s", Platform.OS, Platform.Version);
// debug("load11 %s %s", Platform.OS, Platform.Version);
// console.ignoredYellowBox = ['Remote debugger'];
AppRegistry.registerComponent('XOXO', () => App);
