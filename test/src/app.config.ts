export default {
  pages: ['pages/index/index', 'pages/logs/logs'],
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'images/wechat.png',
        selectedIconPath: 'images/wechat_selected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/logs/logs',
        iconPath: 'images/twitter.png',
        selectedIconPath: 'images/twitter_selected.png',
        text: '日志',
      },
    ],
  },
  subpackages: [
    {
      root: 'pages/product',
      pages: ['productDetail', 'productList'],
    },
  ],
  usingComponents: {
    'index-component': './components/index-component/index-component',
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
};
