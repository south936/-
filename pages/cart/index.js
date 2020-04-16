// pages/cart/index.js
/**
* 1 获取用户收货地址
*    1.绑定单击事件
*    2.调用小程序内置api 获取用户的收货地址
* 
*    2.获取 用户 对小程序 所授权 获取地址的 权限 状态 scope
*      1. 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
*      scope 值 true
*      2.假设 用户 从来没有调用过 收货地址的api
*      scope  值 undefined
*      3. 假设 用户 点击获取收货地址的提示框 取消 
*      scope 值 false 
*        1.诱导用户自己打开授权设置页面 当用户重新给与 获取地址权限的时候
*        2.获取收货地址
*      4.把获取到的收货地址 存入到 本地存储中
* 2. 页面加载完毕
*    0 onLoad  onShow
*    1.获取本地存储中的地址数据
*    2.把数据 设置给data中的一个变量
* 3.onShow
*    1 获取缓存中的购物车数组
*    2 把购物车中的数据 填充到data中
* 4.全选的实现
*    1 onShow 获取缓存中的购物车数组
*    2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就全部选中了
* 5.总价格和总数量
*    1 都需要商品被选中 我们才拿它计算
*    2 获取购物车数组
*    3 遍历
*    4 判断商品是否被选中
*    5 总价格 += 商品价格 * 商品数量
*    5 总数量 +=选中商品数量
*      把计算后的价格和数量 设置回data中即可
* 6.商品的选中功能
*    1 绑定change事件
*    2 获取到被修改的商品对象
*    3 商品对象的选中状态 取反
*    4 重新填回data中和缓存中
*    5 重新计算全选,总价格 总数量...
* 7.商品数量编辑功能
*    1 "-" "+" 按钮 绑定同一个点击事件 区分关键 自定义属性
*        1 "+" "+1"
*        2 "-" "-1"
*    2 传递被点击的商品id goods_id
*    3 获取data中的购物车数组 来获取需要被修改的商品对象
*    4 直接修改商品对象的数量 num
*      弹窗提示 询问用户 是否删除
*      1 确定 直接删除
*      2 取消 什么都不做
*    5 把cart数组 重新设置回 缓存中 和data 中
* 8.点击结算 
    1判断有没有收货地址信息
    2判断用户有没有选购商品
    3经过以上验证跳转到支付页面
*    
*/
import { getSetting, chooseAddress, openSetting, showModel,showToast } from "../../utils/async"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalprice: 0,
    totalnum: 0
  },
  onShow() {
    //1.获取缓存中的收货地址数据
    const address = wx.getStorageSync("address");
    //3.1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //点击收货地址
  async handleChooseAdress() {

    // wx.getSetting({
    //   success: (result)=>{
    //     // 获取权限状态 主要发现一些 属性名怪异的时候 都要使用 []形式来获取属性值
    //     const scopeAddress =result.authSetting["scope.address"];
    //     if(scopeAddress === true||scopeAddress === undefined){
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         },
    //         fail: ()=>{},
    //         complete: ()=>{}
    //       });
    //     } else{
    //       //用户 以前拒绝过授予权限 先诱导用户打开授权页面
    //       wx.openSetting({
    //         success: (result2)=>{
    //           // console.log(result2)
    //          // 可以调用 收货地址代码
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3)
    //             },
    //             fail: ()=>{},
    //             complete: ()=>{}
    //           });
    //         }
    //       });
    //     }
    //     console.log(result)
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });



    try {
      //1.获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      //2 判断权限状态
      if (scopeAddress === false) {
        //3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
        await openSetting();
      }
      //4 调用获取收货地址 api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

      // console.log(res2)
      //5 存入到缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },
  //商品的选中
  handeItemChange(e) {
    //获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //2.获取购物车数组
    let { cart } = this.data;
    //3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //4. 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  //商品数量
  async handeItemNumEdit(e) {
    //1.获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // console.log(operation,id);
    //2.获取购物车数组
    let { cart } = this.data;
    //3.找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    //4 判断是否删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModel({ content: '是否要删除?' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      //4 进行修改数量
      cart[index].num += operation
      //5 设置回缓存data中
      this.setCart(cart);
    }

  },
  //点击结算
 async handlePay(){
  //  console.log(111)
    //1. 判断收货地址
    const {address,totalnum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有填写收货地址"});
      return;
    }
    //2. 判断用户有没有选购商品
    if(totalnum === 0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    //3.跳转支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  },
  //设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价 购买数量
  setCart(cart) {
    let allChecked = true;
    // 5.1 总价格 总数量
    let totalprice = 0;
    let totalnum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalprice += v.num * v.goods_price;
        totalnum += v.num;
      } else {
        allChecked = false;
      }

    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalprice,
      totalnum
    })
    wx.setStorageSync("cart", cart);
  }



})