//0 引入 用来发送请求的方法
import {request,request2} from "../../request/index"
//Page Object
Page({
  data: {
    //轮播图数组
    swiperList: [],
    catesList:[],
    floorList:[]
  },
  //options(Object)
  //页面开始加载
  onLoad: function (options) {
    //1.开始发送异步请求获取轮播图数据
    /* var reqTask = wx.request({
      url: 'http://localhost:3000/swiperList',
      success: (result) => {
        console.log(result.data);
        var data = result.data;
        if (data.sucess === 200) {
          this.setData({
            swiperList: data.data
          })
        }
      },
      fail: () => { },
      complete: () => { }
     });
     */
    this.getswiperList();
    this.getcatesList();
    this.getfloordata();
  },
  //获取轮播数据
  getswiperList(){
    request({
    url: '/swiperList',
  }).then(result =>{
    var data = result.data;
      if (data.sucess === 200) {
        this.setData({
          swiperList: data.data
        })
      }
  })
  },
   //获取分类导航数据
  getcatesList(){
    request({
      url: '/catesList',
    }).then(result =>{
      var data = result.data;
        if (data.sucess === 200) {
          console.log(data)
          this.setData({
            catesList: data.data
          })
        }
    })
  },
  //获取楼层
  getfloordata(){
    request2({
      url:"/home/floordata"
    }).then(result =>{
      this.setData({
        floorList: result.data.message
      })
    })
  }
});