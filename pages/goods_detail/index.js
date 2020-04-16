// pages/goods_detail/index.js
/**
 
1 发送请求获取数据
2 点击轮播图绑定点击事件
  1 给轮播图绑定点击事件
  2 调用小程序api previewImage
3 点击加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断 当前商品是否已存在购物车
  4 已经存在 修改商品数据 执行购物车该商品数量++ 重新把购物车数组 填回缓存中
  5 不存在于购物车数组中 直接给购物车数组添加一个新的元素 新元素带上 购买数量属性 num 重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onshow的时候 加载缓存中的商品收藏的数据
  2 判断当前商品是不是收藏
    1 是 改变页面图标
    2 不是
  3 点击商品收藏按钮
    1 判断该商品是否存在该缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存数组中
 */
import{request2} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    //商品是否被收藏过
    isCollect:false,
    
    
  },
  goodsInfo:{},
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
//获取商品详情数据
  async getGoodsDetail(goods_id){
    const res=await request2({url:"/goods/detail",data:{goods_id}})
    const goodsObj=res.data.message
    this.goodsInfo=goodsObj;
    //1 获取商品收藏缓存中的数组
    let collect=wx.getStorageSync("collect")||[];
    //判断当前商品是不是被收藏
    let isCollect=collect.some(v=>v.goods_id ===this.goodsInfo.goods_id)
    this.setData({
      goodsObj:{
      goods_name:goodsObj.goods_name,
      goods_price:goodsObj.goods_price,
      goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
      pics:goodsObj.pics
      },
      isCollect
    })
  },
  //点击轮播图放大预览
   handlePrevewImage(e){
    console.log(e)
    // 构造要预览的图片数组
    const urls=this.goodsInfo.pics.map(v=>v.pics_mid);
    //接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  //点击加入购物车
  handleCarrtAdd(){
    // 1.获取缓存中的数组
    let cart=wx.getStorageSync("cart")||[];
    //2.判断 商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    if(index ===-1){
      //3不存在
      // 第一次添加
      this.goodsInfo.num=1;
      this.goodsInfo.checked=true;
      cart.push(this.goodsInfo)
    }else{
      // 4.已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5.把购物车从新添加回缓存中
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  //点击收藏商品 或取消收藏
  handleCollect(){
    let isCollect=false
    //获取商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.goodsInfo.goods_id);
    //3 当index !=-1 表示 已经收藏过
    if(index !== -1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: false
      });
    }else{
      //没有收藏过
      collect.push(this.goodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: false
      });
    }
    //4 把数组存入缓存中
    wx.setStorageSync("collect",collect);
    //5 修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
 
})