const webpack = require('webpack');
const path = require('path');
const ejs = require('ejs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');
const WebpackNotifierPlugin = require('webpack-notifier');
const stripANSI = require('strip-ansi');

const config = {
    mode: process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'background': './background.js',
        'tab/index': './extension/index.js',
        'popup/index': './popup/index.js',
        'tab/helpers/pc_app_provider': './extension/helpers/pc_app_provider.js',
        'login/index': './login/index.js',
        'web/index': './web/index.js',
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
            '@': path.resolve(__dirname, 'src'),
            lib: path.resolve(__dirname, 'src/lib'),
            '@lib': path.resolve(__dirname, 'src/lib'),
            '@app': path.resolve(__dirname, 'src/app'),
            '@web': path.resolve(__dirname, 'src/web'),
            '@popup': path.resolve(__dirname, 'src/popup'),
            components: path.resolve(__dirname, 'src/app/components'),
            mixins: path.resolve(__dirname, 'src/app/mixins'),
            // Required for Vue Portal, because it imports another Vue and creates an error in runtime
            'vue$': 'vue/dist/vue.esm-bundler.js',
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
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
            },*/
            {
                test: /\.vue\.(s?[ac]ss)$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                quietDeps: true,
                            },
                        }
                    }
                ],
            },
            {
                test: /(?<!\.vue)\.(s?[ac]ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                quietDeps: true,
                            },
                        }
                    }
                ]
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
        new CopyPlugin({
            patterns: [
                { from: 'icons', to: 'icons' },
                { from: 'extension/index.html', to: 'tab/index.html', transform: transformHtml },
                { from: 'extension/helpers', to: 'tab/helpers' },
                { from: 'login/index.html', to: 'login/index.html', transform: transformHtml },
                { from: 'web/index.html', to: 'web/index.html', transform: transformHtml },
                { from: 'popup/index.html', to: 'popup/index.html', transform: transformHtml },
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
            ]
        }),
    ],

    performance: {
        // Get rid of warning "asset size limit"
        hints: false,
    },
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
