/**
 * html页面配置
 * 一个页面对应一个 new HtmlWebpackPlugin
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
    new HtmlWebpackPlugin({ //页面1 项目开发请填写注释
        filename: 'page1.html',
        template: 'src/page1.html',
        chunks: ['common', 'page1']
    }),
    new HtmlWebpackPlugin({ //页面2
        filename: 'page2.html',
        template: 'src/page2.html',
        chunks: ['common', 'page2']
    })
];