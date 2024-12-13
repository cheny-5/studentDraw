module.exports = {
	publicPath: './',
	devServer: {
		proxy: {
		  '/api': {
			target: 'http://192.168.31.212:8000',
			changeOrigin: true,
			pathRewrite: {
			  '^/api': '',
			},
		}
		},
	  }
}

