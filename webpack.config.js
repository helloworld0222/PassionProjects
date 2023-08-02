require('dotenv').config();
const path = require('path');
const webpack = require('webpack');

const clientPath = path.join(__dirname, 'client');
const serverPublicPath = path.join(__dirname, 'server/public');
console.log('DEV_SERVER_PORT:', process.env.DEV_SERVER_PORT);

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: clientPath,
  output: {
    path: serverPublicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: clientPath,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-react-jsx']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'SPOTIFY_CLIENT_ID',
      'SPOTIFY_AUTH_CALLBACK_SENDER',
      'SPOTIFY_AUTH_CALLBACK_RECIPIENT'
    ])
  ],
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: process.env.DEV_SERVER_PORT,
    historyApiFallback: true,
    static: {
      directory: serverPublicPath,
      publicPath: '/',
      watch: {
        ignored: path.join(serverPublicPath, 'images')
      }
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Backend server URL
        changeOrigin: true
      }
    }
  },
  stats: 'summary',
  performance: {
    hints: false
  }
};
