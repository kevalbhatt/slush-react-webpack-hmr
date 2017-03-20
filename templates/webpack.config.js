const path = require('path');
const webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'public');
var APP_DIR = path.resolve(__dirname, 'app');

module.exports = {
    entry: APP_DIR + "/index.jsx",
    output: {
        path: __dirname + '/public/', //<- This path is use at build time
        filename: "bundle.js", //<- This file is created under path which we specified in output.path 
        publicPath: "/static/" //<- This path is for dev server. you cant see this folder
    },
    module: {
        loaders: [{
            test: /\.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            include: APP_DIR,
            // query: {
            //     presets: ["es2015", "react", "react-hmre"] <- either specify hear or in .babelrc
            // }
        }]
    }
}
