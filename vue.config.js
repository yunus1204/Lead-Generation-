const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    https: false,     // Ensure server runs on HTTP, not HTTPS
    hot: false,       // Disable Hot Module Replacement (HMR)
    liveReload: false // Disable live reload (auto page refresh)
  }
})
