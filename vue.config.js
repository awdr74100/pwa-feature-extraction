module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: '特徵提取',
    },
  },
  devServer: {
    open: true,
    port: 3001,
    disableHostCheck: true,
  },
  pwa: {
    name: 'feature-extraction',
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
    },
  },
};
