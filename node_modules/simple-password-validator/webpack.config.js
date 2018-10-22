'use strict';

var webpack = require('webpack');

var ENV = process.env.npm_lifecycle_event;

module.exports = function makeWebpackConfig() {

    var config = {
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                }]
        },
        plugins: [],
        externals: {
            angular: 'angular',
            moment: 'moment',
            lodash: '_'
        },
        devtool: '#source-map'
    };

    config.entry = {
        app: './src/index.js'
    };


    config.output = {
        path: __dirname + '/dist',
        filename: 'password-validator.js',
        library: 'passwordValidator',
        libraryTarget: 'umd'
    };

    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

    return config;
}();
