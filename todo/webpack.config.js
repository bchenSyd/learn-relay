const path = require('path')
const webpack = require('webpack')

var config =
    {
        debug: true,
        devtool: 'source-map',
        entry: path.resolve(__dirname, 'js', 'index.js'),
        output: {
            filename: 'bundle.js',
            publicPath: '/',
            path: path.join(__dirname, 'public'),
        },
        module: {
            loaders: [
                {
                    exclude: /node_modules/,
                    loader: 'babel',
                    test: /\.js$/,
                },
            ],
        },
        devServer: {
            historyApiFallback: true,
            proxy: { '/graphql': `http://localhost:8080` },
        }
    }

module.exports = config