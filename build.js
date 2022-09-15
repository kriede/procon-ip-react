'use strict'

const rewire = require('rewire')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const { InjectManifest } = require('workbox-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { SourceMapDevToolPlugin } = require('webpack')

const defaults = rewire('react-scripts/scripts/build.js')
const config = defaults.__get__('config')

// Change webpack configuration for
// - be compatible with 8.3 file system of the Procon.IP pool controller
// - optimise chucks for best loading perfcormance on the Procon.IP

config.output.filename = 'js/[name]/[contenthash:8].js'
config.output.chunkFilename = 'js/[name]/[contenthash:8].js'

const miniCssExtractPlugin = config.plugins.find(plugin => plugin instanceof MiniCssExtractPlugin)
miniCssExtractPlugin.options.filename = 'css/[contenthash:8].css'
miniCssExtractPlugin.options.chunkFilename = 'css/[name]/[contenthash:8].css'

const manifestPlugin = config.plugins.find(plugin => plugin instanceof WebpackManifestPlugin)
manifestPlugin.options.fileName = 'assets.jsn'

const workboxWebpackPlugin = config.plugins.find(plugin => plugin instanceof InjectManifest)
manifestPlugin.options.exclude = [/\.map$/, /assets\.jsn$/, /LICENSE/]

const terserPlugin = config.optimization.minimizer.find(plugin => plugin instanceof TerserPlugin)
terserPlugin.options.extractComments = false

config.plugins.push(new SourceMapDevToolPlugin({
//  filename: (pathData) => { return pathData.} // '[ext]/[name]/[contenthash:8].map'
  filename: 'map/[name]/[contenthash:8].map'
}))

// Consolidate chunk files instead
config.optimization.splitChunks = {
  cacheGroups: {
    default: false,
  },
}

// Move runtime into bundle instead of separate file
config.optimization.runtimeChunk = false
