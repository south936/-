/**
 * 1.页面加载的时候
 *  1 从缓存中获取购物车的数据 渲染到页面中
 *    这些数据必须 checked=true
 * 2. 微信支付
 *  1 哪些人 哪些账号 可以实现微信支付
 *    1 企业账号
 *    2 企业账号的小程序后台中 必须 给开发者 添加上白名单
 *      1 一个Appid 可以绑定多个开发者 
 *      2 这些开发者就可以公用这个appid 和 他的开发权限 
 * 3.支付按钮
 *  1 先判断缓存中有没有token
 *  2 没有 跳转到授权页面 进行获取token
 *  3 有token...
 *  4 创建订单 获取订单编号
 *  5 完成微信支付
 *  6 手动删除缓存中的已经选中了的商品
 *  7 删除后的购物车数据 填充会缓存再跳转页面
 */
import { request2 } from "../../request/index";
import { getSetting, chooseAddress, openSetting, showModel, showToast, requestPayment } from "../../utils/async"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalprice: 0,
    totalnum: 0
  },
  onShow() {
    //1.获取缓存中的收货地址数据
    const address = wx.getStorageSync("address");
    //3.1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤掉没有选中商品
    cart = cart.filter(v => v.checked)
    // 5.1 总价格 总数量
    let totalprice = 0;
    let totalnum = 0;
    cart.forEach(v => {
      totalprice += v.num * v.goods_price;
      totalnum += v.num;
    });
    this.setData({
      cart,
      address,
      totalprice,
      totalnum
    })
  },//点击支付
  async handleOrderPay() {
    try {
      //1 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
          success: (result) => {
            console.log(result)
          },
          fail: () => { },
          complete: () => { }
        });
        return
      }
      // console.log('已经存在token')
      // 3创建订单
      //3.1 准备请求头参数
      // const header = { Authorization: token };
      //3.2 准备请求体参数
      const order_price = this.data.totalprice;
      const consignee_addr = this.data.address;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 4.准备发送请求 创建订单 获取订单编号
      const { order_number } = await request2({ url: "/my/orders/create", method: "post", data: orderParams  });
      // console.log(order_number);
      //5. 发起预支付的接口
      const { pay } = await request2({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number } })
      //6.发起微信支付
      await requestPayment(pay);
      // console.log(res)
      //7 查询后台 订单状态
      const res = await request2({ url: "/my/orders/req_unifiedorder", method: "post", data: { order_number } });
      wx.showToast({
        title: '支付成功'
      });
      //8 手动删除缓存中的数据 已支付的商品
      let newCart= wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      //8 支付成功 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      wx.showToast({
        title: '支付失败'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },




})