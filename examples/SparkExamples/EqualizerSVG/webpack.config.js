const path       = require('path');
const CopyPlugin = require('copy-webpack-plugin');

let config = {
    mode: 'development',         // web-pack should default to 'development' build
    watch: true,                        // web-pack watches for changes .. and re-builds
    devtool: 'cheap-module-source-map', // cheap-source-map', //'source-map',

    // optimization: {
    //     runtimeChunk: false,     // seperate file for WebPack Bootstrap
    // },
    entry:  [

        ////////////////////////////////////////////////////////////////////////////////
        //
        //  INPUT FILES
        //
        path.resolve(__dirname, './index.js'),
    ],
    node: {
        fs: 'empty',
        global:false,
        process:false,
        Buffer:false
    },

        ////////////////////////////////////////////////////////////////////////////////
        //
        //  OUTPUT FILES
        //
        // optimization: {
        //    // minimize: true,
        //     moduleIds: 'named'
        //   },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'output.js',
        publicPath: '/dist'

    },
    resolve: {
        alias: {
            root:    path.resolve(__dirname),
            images:  path.resolve(__dirname, './images/'),
            "px.getPackageBaseFilePath()": __dirname
        }
    },
    ////////////////////////////////////////////////////////////////////////////////

    plugins: [
        // new CopyPlugin([
        //     { from: 'images', to: 'images' },
        // ])
    ]
    ////////////////////////////////////////////////////////////////////////////////
};

module.exports = config;
