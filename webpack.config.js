const webpack = require('webpack');
const path = require('path');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');

const config = {
    mode: 'development',//process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'background': './background.js',
        'popup/popup': './popup/popup.js',
        //'options/options': './options/options.js',
        'tab/index': './tab/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            path.resolve(__dirname, './src/tab'),
            'node_modules',
        ],
        extensions: ['.js', '.vue'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [/*MiniCssExtractPlugin.loader, */'vue-style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/images/',
                    emitFile: false,
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'window',
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin([
            { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
            { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
            { from: 'tab/index.html', to: 'tab/index.html', transform: transformHtml },
            { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
            { from: 'vendor', to: 'vendor'},
            {
                from: 'manifest.json',
                to: 'manifest.json',
                transform: (content) => {
                    const jsonContent = JSON.parse(content);
                    jsonContent.version = version;

                    if (config.mode === 'development') {
                        jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
                    }

                    return JSON.stringify(jsonContent, null, 2);
                },
            },
        ]),
    ],
};

if (config.mode === 'production') {
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
    ]);
}

if (process.env.HMR === 'true') {
    config.plugins = (config.plugins || []).concat([
        new ExtensionReloader({
            manifest: __dirname + '/src/manifest.json',
        }),
    ]);
}

function transformHtml(content) {
    return ejs.render(content.toString(), {
        ...process.env,
    });
}

module.exports = config;
