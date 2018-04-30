import {AppRegistry} from 'react-native';
import App from './App';
import debug from "debug";

console.log("load index.js");
debug("load index.js");
AppRegistry.registerComponent('XOXO', () => App);
