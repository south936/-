// pages/search/index.js
import {request2} from "../../request/index" 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    ifFocus:false,
    inpvalue:""
  },
  TimeId:-1,
//输入框的值改变 就会触发的事件
 handleInput(e){
  // 1 获取输入的值
  const {value}=e.detail;
  //2 输入合法性检验
  if(!value.trim()){
    this.setData({
      goods:[],
      ifFocus:false
    })
    //值不合法
    return;
  }
  // 3 准备发送请求
  this.setData({ifFocus:true})
  clearTimeout(this.TimeId);
  this.TimeId=setTimeout(()=>{
    this.qsearch(value);
  },1000)
  
},
//发送请求获取搜索建议
async qsearch(query){
  const res=await request2({url:"/goods/qsearch",data:{query}});
  console.log(res);
  this.setData({
    goods:res.data.message
  })
},
//点击取消
handleCancel(){
  this.setData({
    goods:[],
    ifFocus:false,
    inpvalue:""
  }) 
}
})