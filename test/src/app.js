import isObject from 'lodash/isObject';
import { formatTime } from './utils/util';

console.log(isObject(null));

App({
  globalData: {
    userInfo: null,
  },

  onLaunch() {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    formatTime(new Date());
  },

  getUserInfo(cb) {
    if (this.globalData.userInfo) {
      if (typeof cb === 'function') {
        cb(this.globalData.userInfo);
      }
    } else {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              if (typeof cb === 'function') {
                cb(this.globalData.userInfo);
              }
            },
            fail: e => {
              console.error(e);
            },
          });
        },
        fail: e => {
          console.error(e);
        },
      });
    }
  },
});
