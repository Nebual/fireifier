const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const outputDirectory = 'dist';

module.exports = (env, argv) => {
	const isDevelopment = argv.mode !== 'production';
	return {
		entry: ['babel-polyfill', './src/client/index.js'],
		output: {
			path: path.join(__dirname, outputDirectory),
			filename: 'bundle.js',
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
						},
					},
				},
				{
					test: /\.s[ac]ss$/i,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(png|woff|woff2|eot|ttf|svg)$/,
					loader: 'url-loader',
				},
			],
		},
		resolve: {
			extensions: ['*', '.js', '.jsx'],
		},
		devServer: {
			allowedHosts: 'all',
			compress: true,
			host: '0.0.0.0',
			port: 3000,
			open: true,
			historyApiFallback: true,
			proxy: {
				'/api': 'http://localhost:8080',
			},
		},
		plugins: [
			new CleanWebpackPlugin(),
			new CopyPlugin({
				patterns: [
					{ from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }, //to the dist root directory
				],
			}),
			new HtmlWebpackPlugin({
				template: './public/index.html',
			}),
			isDevelopment && new webpack.HotModuleReplacementPlugin(),
			isDevelopment && new ReactRefreshWebpackPlugin(),
		].filter(Boolean),
	};
};
