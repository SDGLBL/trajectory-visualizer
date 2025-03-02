const webpack = require('webpack');
const path = require('path');

module.exports = {
  style: {
    postcss: {
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions = {
          plugins: [
            require('tailwindcss')('./tailwind.config.js'),
            require('autoprefixer'),
          ],
        };
        return postcssLoaderOptions;
      },
    },
  },
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "http": require.resolve("stream-http"),
          "https": require.resolve("https-browserify"),
          "util": require.resolve("util/"),
          "zlib": require.resolve("browserify-zlib"),
          "stream": require.resolve("stream-browserify"),
          "url": require.resolve("url/"),
          "crypto": require.resolve("crypto-browserify"),
          "assert": require.resolve("assert/"),
          "process": require.resolve("process/browser"),
          "buffer": require.resolve("buffer/"),
          "path": require.resolve("path-browserify")
        }
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: require.resolve("process/browser"),
        Buffer: ['buffer', 'Buffer']
      })
    ]
  }
}; 