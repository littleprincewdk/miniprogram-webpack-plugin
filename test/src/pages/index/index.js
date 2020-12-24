const app = getApp();

Page({
  data: {
    motto: 'Hello World',
    userInfo: null,
  },

  onLoad() {
    app.getUserInfo(userInfo => {
      this.setData({ userInfo });
    });
  },

  onGetUserinfo(e) {
    const { userInfo } = e.detail;
    this.setData({ userInfo });
  },

  goToSubList() {
    wx.navigateTo({
      url: '../product/productList',
    });
  },
});
