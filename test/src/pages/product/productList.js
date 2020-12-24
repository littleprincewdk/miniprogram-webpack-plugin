import { B } from './consts';

console.log(B);

const app = getApp();

Page({
  data: {
    motto: 'Hello List',
    userInfo: {},
  },

  onLoad() {
    app.getUserInfo(userInfo => {
      this.setData({ userInfo });
    });
  },

  onViewTap() {
    wx.navigateTo({
      url: './productDetail',
    });
  },
});
