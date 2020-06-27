
const path = require('path');

var nodeExternals = require('webpack-node-externals');
console.log('process.env.NODE_ENV ',process.env.NODE_ENV)

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
     mode: process.env.NODE_ENV || "production",
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