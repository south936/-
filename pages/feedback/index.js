// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品,商家投诉",
        isActive:false
      }
    ],
    textVal:"",
    //被选中的图片路径数组
    chooseImgs:[]
  },
  UpLoadImgs:[],
  //点击"+" 选择图片
  handleChooseImg(){
    //调用小程序内置api
    wx.chooseImage({
      count: 9,//最多可以选择的图片张数
      //所选的图片的尺寸 原图 压缩
      sizeType: ['original','compressed'],
      //图片来源    相册      照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        console.log(result.tempFilePaths)
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },
  //点击图片删除
  handleDeleteImage(e){
    const {index}=e.currentTarget.dataset;
    let  {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  //文本域的输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  //提交按钮的点击事件
  handleFormsubmit(){
    
    //1获取文本域的内容
    const {textVal,chooseImgs}=this.data;
    //2 合法性验证
    if(!textVal.trim()){
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    //3 准备上传图片到专门的 图片服务器
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    //判断有没有需要上传的图片
    if(chooseImgs.length !=0){
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        filePath: v,
        name: 'file',
        url: 'https://imgchr.com/i/MjaXxU',
        success: (res) => {
            console.log(res);
            console.log(111)
            let url = res.cookies[0];
            console.log(url);
            //将成功上传到服务器到地址返回存储
            this.UpLoadImgs.push(url);
            //判断是否为最后一张图片
            if (i === chooseImgs.length - 1) {

                wx.hideLoading();
                console.log("把文本的内容和外网的图片数组 提交到后台中");
                this.setData({
                  textVal: "",
                    chooseImgs: []
                });
                // 返回上一个页面
                wx.navigateBack({
                    delta: 1
                });
            }
        },
        fail: (err) => {
          console.log(err)
        }
      });
    })
  }else{
    wx.hideLoading();
    console.log("只提交了文本")
    wx.navigateBack({
      delta: 1
    });
  }
  },
//根据标题的索引来激活选中 标题数组
changeTitleByIndex(index){
  //修改源数组
  let {tabs}=this.data;
  tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
  this.setData({
    tabs,
  })
},
 //标题的点击事件 从子组件传递过来的
 handleItemChange(e){
  //1.获取被点击的标题索引
  const {index}=e.detail;
  this.changeTitleByIndex(index);
  //2.重新发送请求 type=1 index=0
  // this.getOrders(index+1)
},
})