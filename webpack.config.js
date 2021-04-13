const webpack = require('webpack');
const path = require('path');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');
const WebpackNotifierPlugin = require('webpack-notifier');
const stripANSI = require('strip-ansi');

const config = {
    mode: 'development',//process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'vendor/vue': ['vue', 'vuex', 'vue-router'],
        'background': './background.js',
        'tab/index': './tab/index.js',
        'login/index': './login/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules',
        ],
        alias: {
            lib: path.resolve(__dirname, 'src/lib'),
            components: path.resolve(__dirname, 'src/tab/components'),
            mixins: path.resolve(__dirname, 'src/tab/mixins'),
            // Required for Vue Portal, because it imports another Vue and creates an error in runtime
            'vue$': require.resolve('vue/dist/vue.esm.js'),
        },
        extensions: ['.js', '.vue'],
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            /*{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },*/
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

    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                vue_libs: {
                    test: /[\\/]node_modules[\\/](vue|vue-router|vuex)/,
                    name: 'vendor/vue',
                    enforce: true,
                    chunks: 'all'
                },
            }
        }
    },

    plugins: [
        new WebpackNotifierPlugin(),
        new webpack.DefinePlugin({
            global: 'window',
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin([
            { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
            { from: 'tab/index.html', to: 'tab/index.html', transform: transformHtml },
            { from: 'login/index.html', to: 'login/index.html', transform: transformHtml },
            //{ from: 'login', to: 'login' },
            { from: 'vendor', to: 'vendor'},
            {
                from: 'manifest.json',
                to: 'manifest.json',
                transform: (content) => {
                    const jsonContent = JSON.parse(content);
                    jsonContent.version = version;

                    if (config.mode === 'development') {
                        //jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
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

/*if (process.env.HMR === 'true') {
    config.plugins = (config.plugins || []).concat([
        new ExtensionReloader({
            manifest: __dirname + '/src/manifest.json',
        }),
    ]);
}*/

function transformHtml(content) {
    return ejs.render(content.toString(), {
        ...process.env,
    });
}

WebpackNotifierPlugin.prototype.compileMessage = function(stats) {
    if (this.isFirstBuild) {
        this.isFirstBuild = false;

        if (this.options.skipFirstNotification) {
            return;
        }
    }

    let error;

    if (stats.hasErrors()) {
        error = stats.compilation.errors[0];
    } else if (stats.hasWarnings() && !this.options.excludeWarnings) {
        error = stats.compilation.warnings[0];
    } else if (!this.lastBuildSucceeded || this.options.alwaysNotify) {
        this.lastBuildSucceeded = true;
        return 'Build successful';
    } else {
        return;
    }

    this.lastBuildSucceeded = false;

    let message;

    if (error.module && error.module.rawRequest)
        message = error.module.rawRequest + '\n';

    if (error.error) {
        message = /*errorSrc[1] + ' ' + errorSrc[2] + */'Error: ' + message + error.error.toString();
    } else if (error.warning) {
        message = 'Warning: ' + message + error.warning.toString();
    } else if (error.message) {
        message = 'Warning: ' + message + error.message.toString();
    }

    return stripANSI(message);
};

module.exports = config;
