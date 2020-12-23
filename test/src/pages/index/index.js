// 获取应用实例
const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
  },
  // 事件处理函数
  bindViewTap() {
    wx.switchTab({
      url: '../logs/logs',
    });
  },
  goToSubList() {
    wx.navigateTo({
      url: '../product/productList',
    });
  },
  onLoad() {
    // await delay();

    // const log = flow(() => {
    // 	console.log('onLoad');
    // });

    // log();

    // 调用应用实例的方法获取全局数据
    app.getUserInfo(userInfo => {
      // 更新数据
      this.setData({ userInfo });
    });
  },
});
