const path = require('path')
const webpack = require('webpack')


const config = {
    devtool: 'source-map',
    entry: path.resolve(__dirname, 'src', 'app.js'),
    module: {
        loaders: [
            {
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                test: /\.jsx?$/,
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback: true,
        proxy: { '/graphql': `http://localhost:8002` },
    }
}

module.exports = config