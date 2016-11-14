const gulp = require("gulp");
const path = require('path');
const gutil = require("gulp-util");
const clean = require("gulp-clean");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
let webpackConfig = require("./webpack.config.js");
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// 先打包测试文件，启动webpack开发服务器
gulp.task("default", ["webpack-dev-server"]);
//清除文件夹
gulp.task('clean-www', function () {
    gulp.src('www', {read: false})
        .pipe(clean());
});
//发布打包，代码压缩
gulp.task("build", ["clean-www", "webpack:build"]);
gulp.task("webpack:build", function (callback) {
    // 增加或修改些webpack配置
    var myConfig = Object.create(webpackConfig);
    myConfig.output.path = path.resolve(__dirname, 'www');
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,  // 去除注释
            },
            compress: {
                warnings: false,
                drop_console:true,//去除console
                drop_debugger:true//去除debugger
            }
        })
    );
    // 启动生产打包
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        //复制文件夹
        gulp.src(['src/lib/**'], {base: './src'})
            .pipe(gulp.dest('www'))
    });
});
//开启webpack-dev-server服务器
gulp.task("webpack-dev-server", function () {
    // 增加或修改些webpack配置
    var myConfig = Object.create(webpackConfig);
    myConfig.entry.main.unshift("webpack-dev-server/client?http://localhost:8080", "webpack/hot/dev-server");
    myConfig.output.path = path.resolve(__dirname, 'src');
    myConfig.output.publishPath ='src';
    myConfig.devtool = "eval";
    myConfig.debug = true;
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({url: 'http://localhost:8080'})
    );
    // 开启web-dev-server服务器
    new WebpackDevServer(webpack(myConfig), {
        contentBase: 'src',
        hot: true,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: {
            colors: true
        }
    }).listen(8080, "0.0.0.0", function (err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080");
    });
});
