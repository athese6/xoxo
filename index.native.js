import {AppRegistry, Platform} from 'react-native';
import App from './client/App';
import debug from "debug";

console.log("load %s", Platform.OS, Platform.Version);
debug("load %s %s", Platform.OS, Platform.Version);
AppRegistry.registerComponent('XOXO', () => App);
