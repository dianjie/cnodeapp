const path = require('path');
const nodeModulesPath=path.resolve(__dirname, 'node_modules');
const pxtorem = require('postcss-pxtorem');
const webpack = require("webpack");
const Visualizer = require('webpack-visualizer-plugin');
const HtmlWepackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const src = path.join(__dirname, './src');
module.exports = {
    cache: true,
    entry: {
        'main':[path.resolve(__dirname, 'src/main.js')],
        'vendor':["react", "react-dom",'react-router','react-redux']
    },
    output: {
        filename: "js/[name].js"
    },
    postcss: function () {
        return [
            require('precss'),
            require('autoprefixer'),
            pxtorem({
                rootValue: 100,
                propWhiteList: [],
            })
        ];
    },
    resolve: {
        alias: {
            // 自定义路径别名
            PAGE: path.join(src, 'page'),
            REDUX: path.join(src, 'redux'),
            SYSTEM: path.join(src, 'system')
        }
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader") },
            // { test: /\.css$/, loader: "style-loader!css-loader!postcss-loader" },

            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?.*)?$/,
                loader:'file?name=styles/[name].[ext]'
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url?limit=10000&name=img/[name].[ext]'
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015',"stage-0"],
                     //transform-class-properties:支持es6 static
                    plugins: ["transform-class-properties",["import", {
                        style: 'css',
                        libraryName: 'antd-mobile',
                    }]],
                    env: {
                        production: {
                            presets: ["react-optimize"]
                        }
                    }
                },
                include: [src]
            }

        ]
    },
    plugins: [
        //打包分析
        new Visualizer(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity
        }),
        // new webpack.ProvidePlugin({}),
        new HtmlWepackPlugin({
            template: __dirname + '/template.html',
            filename: 'index.html',
            inject: true,
            chunks: ['main','vendor'],
            minify: {    //压缩HTML文件
                removeComments: true,    //移除HTML中的注释
                collapseWhitespace: true   //删除空白符与换行符
            }
        }),
        new ExtractTextPlugin("styles/index.css")
    ]
};
