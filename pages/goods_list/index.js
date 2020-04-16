// pages/goods_list/index.js
import { request, request2 } from "../../request/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[],
    pagenum:1,
    //总页数
    totalPages:1,
    
  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //标题的点击事件 从子组件传递过来的
  handleItemChange(e){
    //1.获取被点击的标题索引
    const {index}=e.detail;
    //修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs,
    })
  }
  ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options);
      this.QueryParams.cid=options.cid||"";
      this.QueryParams.query=options.query||"";
      this.getGoodsList();
  },
//获取商品列表的数据
async getGoodsList(){
  const res=await request2({url:"/goods/search",data:this.QueryParams});
  //获取总条数
  const total=res.data.message.total;
  //计算总页数
  this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  console.log(res.data.message)
  this.setData({
    goodsList:[...this.data.goodsList,...res.data.message.goods],

  })
},
 
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.pagesize=1;
    //从新发送请求
    this.getGoodsList();
    //停止当前页面下拉刷新。
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.QueryParams.pagenum>=this.totalPages){
      // console.log('%c'+'没有下一页', 'color: red;font-size: 24px;font-weight: bold;text-decoration: underline;');
      wx.showToast({
        title: '没有商品了,到底了,别在拉了',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }else{
      // console.log('%c'+'还有下一页', 'color: red;font-size: 24px;font-weight: bold;');
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
})