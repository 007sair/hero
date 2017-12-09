/**
 * webpack config
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const gutil = require('gulp-util');

const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

let __DEV__ = gutil.env._[0] == 'dev' ? true : false;
let pageConfig = require('./page.config.js');
let dirVars = require('./dir-vars.config.js');

//获取多页面的每个入口文件，用于配置中的entry
function getEntry() {
    let jsPath = path.resolve(dirVars.srcDir, 'js');
    let dirs = fs.readdirSync(jsPath);
    let matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(dirVars.srcDir, 'js', item);
        }
    });
    return files;
}

let config = {
    // devtool: __DEV__ ? 'eval' : '',
    entry: getEntry(),
    output: {
        path: path.resolve(dirVars.distDir),
        publicPath: "/",
        filename: __DEV__ ? 'js/[name].min.js' : 'js/[name].min.js?v=[chunkhash:10]',
        chunkFilename: "js/[name].js"
    },
    resolve: {
        alias: {
            'Lib': path.resolve(dirVars.srcDir, './js/lib'),
            'Mod': path.resolve(dirVars.srcDir, './js/mod'),
            'CSS': path.resolve(dirVars.srcDir, './css')
        },
        extensions: ['.js', '.css', '.scss'],
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: ['js/vendor.min.js'],
            files: '*.html',
            append: false,
            hash: !__DEV__ ? true : false
        }),
        new webpack.DllReferencePlugin({
            context: dirVars.rootDir,
            manifest: require(path.resolve(dirVars.rootDir, "vendor.manifest.json")),
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(dirVars.srcDir, 'assets/sprites/'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(dirVars.distDir, 'images/icon-sprite.png'),
                css: [
                    [
                        path.resolve(dirVars.srcDir, 'css/_sprites.scss'), {
                            format: 'scss_template_handlebars'
                        }
                    ]
                ]
            },
            spritesmithOptions: {
                padding: 15
            },
            apiOptions: {
                cssImageRef: "/images/icon-sprite.png"
            },
            customTemplates: { //自定义模板
                'scss_template_handlebars': path.resolve(dirVars.rootDir, 'config/scss.template.handlebars')
            }
        }),
    ]
};

if (!__DEV__) {
    config.plugins = config.plugins.concat([
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ])
}


config.plugins = config.plugins.concat(pageConfig);

module.exports = config;