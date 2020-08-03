const webpack  = require('webpack');
const path     = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
    mode: 'development',         // web-pack should default to 'development' build
    watch: false,                // web-pack watches for changes .. and re-builds
    devtool: 'cheap-source-map', //cheap-source-map', //'source-map',
    // optimization: {
    //     runtimeChunk: false,     // seperate file for WebPack Bootstrap
    // },
    entry:  [

        ////////////////////////////////////////////////////////////////////////////////
        //
        //  INPUT FILES
        //
        path.resolve(__dirname, 'Transitions.js'),
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
        filename: 'output.js'
    },
    resolve: {
        alias: {
            images: path.resolve(__dirname, './images/'),
            "px.getPackageBaseFilePath()": __dirname
        }
    },

    devServer:
    {
        ////////////////////////////////////////////////////////////////////////////////
        //
        //  DEV SERVER
        //
        contentBase: path.join(__dirname, "./dist/"),
        publicPath:  path.join(__dirname, "./dist/"),
        inline: false,
        // compress: true,
        port: 8080
    },
    module:
    {
        rules:
        [

        ////////////////////////////////////////////////////////////////////////////////
        //
        //  LOADER: Images
        //
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
            {
                loader: 'file-loader?name=/images/[name].[ext]',
            },
            {
                loader: 'image-webpack-loader?name=/images/[name].[ext]',
                options: {
                    bypassOnDebug: true,  // webpack@1.x
                    disable:       false, // webpack@2.x and newer
                },
            }]

            //NOTE:  image-webpack-loader >>> will 'optimize' images to destination
        },
        ////////////////////////////////////////////////////////////////////////////////
        //
        //  LOADER: Fonts
        //
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
    //
    //  PLUG-IN:
    //
    plugins:
    [
        new webpack.ProvidePlugin({
            'components': 'components',
            'images': 'images',
            'shaders': 'shaders',
        }),
        new CopyWebpackPlugin([
            {from:'images',  to:'images'}
        ]),
    ]
    ////////////////////////////////////////////////////////////////////////////////
};

module.exports = config;
