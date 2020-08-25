const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.fbx$/, loader: 'url-loader' }
    ],
  },
  devServer: {
    // https://sdk.gooddata.com/gooddata-ui/docs/4.1.1/ht_configure_webpack_proxy.html
    proxy: {
      '/static/*': {
        target: 'http://localhost:3001',
        pathRewrite: { '/static': '/' }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};