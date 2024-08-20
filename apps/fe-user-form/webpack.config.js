const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/fe-user-form'),
    publicPath: 'auto',
  },
  devServer: {
    port: 4201,
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.css'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new NxReactWebpackPlugin({
      // Uncomment this line if you don't want to use SVGR
      // See: https://react-svgr.com/
      // svgr: false
    }),
    new ModuleFederationPlugin({
      name: 'feUserForm',
      filename: 'remoteEntry.js',
      exposes: {
        './UserForm': './src/app/UserForm',
      },
      remotes: {
        // Add any remote applications here
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '18.3.1',  // Match this to your installed version
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '18.3.1',  // Match this to your installed version
        },
      },
    }),
  ],
};
