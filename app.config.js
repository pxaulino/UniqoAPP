const appJson = require("./app.json");

/** @type {import("@expo/config-types").ExpoConfig} */
const config = {
  ...appJson.expo,
  newArchEnabled: true,
  android: {
    ...appJson.expo.android,
    edgeToEdgeEnabled: true,
  },
};

module.exports = config;
