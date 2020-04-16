let ajaxtimes=0;
export const request=(params)=>{
    ajaxtimes++;
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    const baseUrl=`http://localhost:443`
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxtimes--;
                //关闭正在等待的图标
                if(ajaxtimes===0){
                    wx.hideLoading();
                }
               
            }
        })
    })
}
export const request2=(params)=>{
    //判断 url 中是否带有 /my/ 请求的是私有的路径 带上header token
    let header={...params.header};
    if(params.url.includes("/my/")){
        //拼接header 带上 token
        header["Authorization"]=wx.getStorageSync("token");
    }
    ajaxtimes++;
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公共的url
    const baseUrl=`https://api-hmugo-web.itheima.net/api/public/v1`
    return new Promise((resolve,reject)=>{
        
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxtimes--;
                //关闭正在等待的图标
                if(ajaxtimes===0){
                    wx.hideLoading();
                }
            }
        })
    })
}