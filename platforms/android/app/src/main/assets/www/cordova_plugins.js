cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-splashscreen.SplashScreen",
    "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
    "pluginId": "cordova-plugin-splashscreen",
    "clobbers": [
      "navigator.splashscreen"
    ]
  },
  {
    "id": "cordova-plugin-ionic.common",
    "file": "plugins/cordova-plugin-ionic/www/common.js",
    "pluginId": "cordova-plugin-ionic",
    "clobbers": [
      "IonicCordova"
    ],
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-splashscreen": "5.0.2",
  "cordova-plugin-ionic": "4.0.0",
  "cordova-plugin-whitelist": "1.3.3"
};
// BOTTOM OF METADATA
});