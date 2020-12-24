import { formatTime } from '../../utils/util';
import avatar from '../../images/avatar.png';
import { A } from './consts';

console.log(avatar, A);

Page({
  data: {
    logs: [],
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => formatTime(new Date(log))),
    });
  },
});
