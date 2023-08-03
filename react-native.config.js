

module.exports = {
  project: {
    ios: {},
    android: {}, // grouped into "project"
  },
  assets: ["./SourceFiles/assets/fonts/"], // stays the same
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
  },
};