const HtmlWebpackPlugin = require("html-webpack-plugin")
// 压缩生成的文件
const CompresionWebpackPlugin = require("compression-webpack-plugin")
//  MinicssExtractPlugin将css从js文件中提取出来，减少javascript文件的大小
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// TerserPlugin 是webpack内置的Javascipt代码压缩工具，默认在生产环境下启用
const TerserPlugin = require("terser-webpack-plugin")
const webpack = require("webpack")
const path = require("path")

const resolve = dir => path.resolve(__dirname, dir)

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: resolve("dist"),
    filename: "[name].[contenthash].js",
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: ["style-loader", "css-loader", "postcss-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        use: ["source-map-loader","babel-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    new CompresionWebpackPlugin({
      filename: "[path][base].gz[query]",
      algorithm: "gzip",
      // deleteOriginalAssets:true,
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     comparisons: false,
    //     drop_console: true,
    //     drop_debugger: true,
    //     pure_funcs: ["console.log"],
    //   },
    // }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ["console.log"],
          },
        },
      }),
    ],
    usedExports: true,
    splitChunks:{
      chunks:"all",
      cacheGroups:{
        vender:{
          test:/[\\/]node_modules[\\/]/,
          name:"vender",
          // priority:10,
          chunks:"all",
        }
      }
    }
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  devServer: {
    hot: true,
  },
}
