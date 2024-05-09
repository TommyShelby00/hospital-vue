const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer :{
    port:7070,
    client: {
      overlay: false,
    },
    proxy:{
      '/api':{
        target:'http://localhost:8080',
        pathRewrite:{
          '^/api':''
        }
      },
      'websocket': {
        target: 'http://localhost:8081', // 后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/websocket': '/'  // 重写路径，将 /api 替换为空
        }
      }
    }
  }
})
