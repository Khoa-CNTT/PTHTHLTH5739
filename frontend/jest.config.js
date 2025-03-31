module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    clearMocks: true,
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    testPathIgnorePatterns: ["/node_modules/", "/build/", "<rootDir>/src/App.test.js"],
    moduleFileExtensions: ["js", "jsx", "tsx"],
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js"
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)"
    ],
  };