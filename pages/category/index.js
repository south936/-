// pages/category/index.js
import { request, request2 } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [],
    rightMenuList: [],
    //被点击左侧菜单
    currentIndex: 0,
    //右侧内容滚动条距离顶部的距离
    scrollTop: 0
  },
  //接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getcategory();
    /**
     * 0 web 中的本地存储和小程序中的本地存储的区别
     *  1 写代码的方式不同
     *    web:localStorage.setItem("key","value")  localStorage.getItem("key")
     *    小程序中: wx.setStorageSync("key","value")   wx.getStorageSync("key")
     * 2 存的时候有没有做类型转换
     *    web:不管存入的是什么数据 ,最终先调用一下 toString(),把数据变成字符串在存入进去
     *    小程序:不存在 类型转换这个操作 存的是什么类型,就什么类型
     * 1.先判断一下本地存储中有没有旧数据
     * { time:Date.now(),data:[...]}
     * 2 没有旧数据 直接发送请求
     * 3 有旧数据 同时 旧数据也没有过期 就使用 本地存储中的旧数据即可
     */

    //1 获取本地存储中的数据(小程序中也存在本地存储)
    const Cates = wx.getStorageSync("cates");
    //2. 判断
    if (!Cates) {
      //不存在 发送请求数据
      this.getcategory();
    } else {
      // 有旧数据 定义过期时间 10s 变成5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getcategory();
      } else {
        //否则 可以使用旧的数据
        // console.log("可以使用旧的数据")
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightMenuList = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightMenuList,
        })
      }
    }
  },
  async getcategory() {
    // request2({
    //   url:'/categories'
    // }).then(result =>{
    //   // console.log(result)
    //   this.Cates=result.data.message;
    //   //把接口的数据存入到本地存储
    //     wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    //   console.log(this.Cates)
    //   //构造左侧数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   //构造右侧数据
    //   let rightMenuList=this.Cates[0].children;

    //   this.setData({
    //     leftMenuList,
    //     rightMenuList,

    //   })
    // })
    // 1 使用es7的 async await 来发送请求
    const res = await request2({ url: "/categories" });
    this.Cates = res.data.message;
    //把接口的数据存入到本地存储
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    console.log(this.Cates)
    //构造左侧数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //构造右侧数据
    let rightMenuList = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightMenuList,

    })
  },
  //左侧菜单点击事件
  handleItemTap(e) {
    // console.log(e)
    /*
    1.获取点击标题身上的索引
    给data中的currentIndex赋值就可以了
    */
    const { index } = e.currentTarget.dataset;
    let rightMenuList = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightMenuList,
      //重新设置 右侧内容的scroll-view 标签 的距离顶部 的距离
      scrollTop: 0
    })
  }

})