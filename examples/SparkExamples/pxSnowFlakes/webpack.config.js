const webpack = require('webpack');
const path    = require('path');
const CopyPlugin = require('copy-webpack-plugin');

let config = {
    mode: 'development',
    devtool: "hidden-source-map", //"inline-cheap-source-map",
    entry:  [
        path.resolve(__dirname, './pxSnowflakes.js'),
    ],
    output: {
        filename: 'output.js'
    },
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "./dist"),
        publicPath:  path.join(__dirname, "./dist"),
       // compress: true,
        port: 80
    },
    ////////////////////////////////////////////////////////////////////////////////

    module:
    {
        rules:
        [
        {
            test: /\.(js)?$/i,
            use: [
            {
                loader: 'spark-import-loader',
                options: {
                    base:
                    {
                        "base" : path.resolve(__dirname, './'),
                        "base2": path.resolve(__dirname, './')
                    }
                }
            }]
        },
        ////////////////////////////////////////////////////////////////////////////////
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
            {
                loader: 'file-loader?name=/images/[name].[ext]',
            },
            {
                loader: 'image-webpack-loader?name=/images/[name].[ext]',
                options: {
                bypassOnDebug: true, // webpack@1.x
                disable: false, // webpack@2.x and newer
                },
            }]
        },
        ////////////////////////////////////////////////////////////////////////////////
        {
            test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
            use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }
        ]//rules
    },//modules
    ////////////////////////////////////////////////////////////////////////////////
    plugins: 
    [
        new CopyPlugin([
            { from: 'images', to: 'images' },
        ]),
    ]
};

config.resolve = {
    alias:
    {
        images: path.resolve(__dirname, './images'),
        base:   path.resolve(__dirname, './'),
    }
}

module.exports = config;
