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
    name: 'Extraction',
    themeColor: '#20c997',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
    },
  },
};
