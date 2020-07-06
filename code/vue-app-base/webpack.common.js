const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.js', //打包的入口
    module: {
        rules: [{
                test: /\.(js|vue)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.resolve('src')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                }
            },
            {
                test: /\.(png|svg|jpg|gif|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024, //10KB,url-loader只会将小于10KB的文件转化为Data URLs嵌入代码中
                        esModule: false,
                    }
                }
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
                test: /\.js$/,
                use: [
                    'babel-loader'
                ],
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify(process.env.BASE_URL)
        }),
        new VueLoaderPlugin(),
    ]
}