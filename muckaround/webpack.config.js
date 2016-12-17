const path = require('path')
const webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    debug:true,
    devtool:'source-map',
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
        })
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            }]
    },
    devServer: {
        historyApiFallback: true,
        proxy: { '/graphql': `http://localhost:8002` },
    }
}
module.exports = config
