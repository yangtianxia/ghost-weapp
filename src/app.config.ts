const config = {
  pages: [
    'pages/index/index'
  ],
  subpackages: [
    {
      root: 'subpackage',
      pages: [
        'error/index'
      ]
    },
    {
      root: 'examples',
      pages: [
        'waterfall-flow/index'
      ]
    }
  ],
  window: {
    navigationStyle: 'custom',
    backgroundColor: '@grey-1',
    backgroundColorTop: '@grey-1',
    backgroundColorBottom: '@grey-1',
    navigationBarTextStyle: '@navigation' as unknown,
    navigationBarBackgroundColor: '@section',
    navigationBarTitleText: process.env.PROJECT_NAME
  },
  useExtendedLib: {
    weui: true
  },
  style: 'v2'
} as Taro.Config

// 支付宝特性配置
if (process.env.TARO_ENV === 'alipay') {
  config.window = {
    ...config.window,
    titleBarColor: '@section'
  }
}

export default defineAppConfig(config)
