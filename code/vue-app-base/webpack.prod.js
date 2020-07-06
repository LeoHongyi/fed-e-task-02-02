const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin"); // 引入清除打包结果的插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const prodConfig = {
    mode: 'production',
    output: {
        path: path.join(__dirname, "dist"),
        filename:"[name]-[contenthash:8].bundle.js"
    },
    optimization:{
        minimizer:[
            new TerserWebpackPlugin(),
            new OptimizeCssAssetsWebpackPlugin(),
        ]
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    devtool: "nosources-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vue App Project',
            template: path.join(__dirname, './public/index.html'),
            /* minify: {
                collapseWhitespace: false,
                removeComments: false,
                removeAttributeQuotes: false, // 移除属性的引号
            } */
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.join(__dirname, 'src/assets'),
                to: path.join(__dirname, 'dist/assets')
            }, {
                from: path.join(__dirname, 'public/'),
                to: path.join(__dirname, '/dist')
            }],
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:"[name]-[contenthash:8].bundle.css"
        }),
    ]
}

module.exports = merge(common, prodConfig);