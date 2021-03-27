const webpack = require('webpack')

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");


const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');


module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  devtool: 'eval-source-map',
  target: 'web',
  module: {
      rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ['style-loader', 'css-loader']
      }, 
      // {
      //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
      //   type: 'asset/resource',
      // },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ],
  },
  resolve: {
    extensions: [  '.ts',  '.tsx', '.js', '.json' ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/index.html'), // template file
      filename: 'index.html', // output file
    }),
    new CleanWebpackPlugin(),
    new MonacoWebpackPlugin({
      languages: ['cpp', 'javascript', 'rust'],
      features: ['accessibilityHelp', 'anchorSelect', 'bracketMatching', 'caretOperations', 'clipboard', 'codeAction', 'codelens', 'colorPicker', 'comment', 'contextmenu', 'coreCommands', 'cursorUndo', 'dnd', 'documentSymbols', 'find', 'folding', 'fontZoom', 'format', 'gotoError', 'gotoLine', 'gotoSymbol', 'hover', 'iPadShowKeyboard', 'inPlaceReplace', 'indentation', 'inlineHints', 'inspectTokens', 'linesOperations', 'linkedEditing', 'links', 'parameterHints', 'quickCommand', 'quickHelp', 'quickOutline', 'referenceSearch', 'rename', 'smartSelect', 'snippets', 'suggest', 'toggleHighContrast', 'toggleTabFocusMode', 'transpose', 'unusualLineTerminators', 'viewportSemanticTokens', 'wordHighlighter', 'wordOperations', 'wordPartOperations'],
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CopyPlugin({
      patterns: [
        {
          to({ context, absoluteFilename }) {
            return `src/textures/${path.relative(context, absoluteFilename)}`;
          },
          from: "src/textures",
        },
      ],
    }),
  ],
  experiments: {
    // outputModule: true,
    // syncWebAssembly: true,
    topLevelAwait: true,
    //asyncWebAssembly: true,
    // layers: true,
  },


  mode: 'development',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
}




      // {
      //   test: /\.s[ac]ss$/i,
      //   use: [
      //     // Creates `style` nodes from JS strings
      //     "style-loader",
      //     // Translates CSS into CommonJS
      //     {
      //       loader: "css-loader",
      //       options: { modules: true },
      //     },
      //     // Compiles Sass to CSS
      //     "sass-loader",
      //   ],
      // },