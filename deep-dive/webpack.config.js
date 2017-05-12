const path = require('path')
const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

var config = {
    debug: true,
    devtool: 'source-map',
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Learn Relay',
            filename: 'index.html'
        }),
        new ExtractTextPlugin('style.css')
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', "css!postcss!less")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', "css!postcss")
            }]
    },

    postcss: (webpack) => {
        return [
            autoprefixer({
                browsers: ['last 2 versions']
            })]
    },

    devServer: {
        historyApiFallback: true,
        proxy: { '/graphql': `http://localhost:8002` },
    }
}
module.exports = config
