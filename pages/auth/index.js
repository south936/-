import {login} from "../../utils/async";
import {request2} from "../../request/index"
Page({
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取用户信息
 async handleGetUserInfo(e){
   try {
      //获取用户信息
   const {encryptedData,iv,rawData,signature}=e.detail;
   //获取小程序登录成功后的code
   const {code}=await login();
   const loginParams={encryptedData,iv,rawData,signature,code}
  // 发送请求 获取用户的token值
  //
  // const {token}=await request2({url:"/users/wxlogin",data:loginParams,method:"post"});
  const token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
  wx.setStorageSync("token", token);
  wx.navigateBack({
    delta: 1
  });
   } catch (error) {
     console.log(error)
   }
 }
})