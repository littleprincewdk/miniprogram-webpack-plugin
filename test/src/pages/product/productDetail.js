import { formatTime } from '../../utils/util';
import avatar from '../../images/avatar.png';

console.log(avatar);

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
