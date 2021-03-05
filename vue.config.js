module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    },
    i18n: {
      locale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
