
const path = require('path');
//const isDevelopment = process.env.NODE_ENV !== 'production'
var nodeExternals = require('webpack-node-externals');

const config = {
    entry: {
      main: path.resolve('./index.ts')
    },
    target: "node",
    externals: [nodeExternals()],
    module: {
      rules: [
        {
            test: /.ts$/,
            use: "ts-loader",
            exclude: /node_modules/
          }
      ]
    },
    // mode: "development",
    resolve: {
        extensions: [".ts", ".js", ".json"],
      alias: {
        app: path.resolve(__dirname, 'app'),
      }
    },
    optimization: {
        minimize: false
    },
    output: {
        path: path.join(__dirname, "build-wp"),
        filename: "index.js"
    }
  }

  module.exports = config