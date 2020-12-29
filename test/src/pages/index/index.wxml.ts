import webpack from './webpack.png';
import utils from '../../utils/util.wxs';

const now = new Date();

export default `
<wxs module="utils" src="${utils}" />
<view class="container">
  <button class="userinfo" open-type="getUserInfo" bindgetuserinfo="onGetUserinfo">
    <block wx:if="{{userInfo}}">
      <image class="userinfo-avatar" src="{{userInfo.avatarUrl}}" />
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
      <text>${now}</text>
    </block>
    <button wx:else>登录</button>
  </button>
  <view class="usermotto {{a > b ? a : b}}">
    <text class="user-motto">{{motto}}</text>
  </view>
  <button bindtap="goToSubList">go to subPackages</button>
  <image src="${webpack}" style="width: 100px; height: 100px" mode="aspectFit" />
</view>
`;
