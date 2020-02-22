import { config } from '../config.js'


const tips = {
  200: "成功",
  400: "失败",
  401: "请先登录",
  500: "错误",
  1: "抱歉,出现了一个错误!"
}

class HTTP{
  request({url,data={},method='GET'}){ //public函数
return new Promise((resolve,reject)=>{
  this._request(url,resolve,reject,data,method)
})
  }



  _request(url,resolve,reject,data={},method='GET'){ //private函数
    wx.request({
      url: config.base_url + url,
      method:method,
      data:data,
      header:{
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:wx.getStorageSync("token")
        
      },
    success:(res)=>{
      const code = res.data.status
      if(code==200){
        resolve(res.data.data)
      }else if(code==401){
        resolve(res.data)
      }else{
        this._showErrMsg(res.data)
      }
    },
    fail:(err)=>{
      wx.hideLoading()
      wx.showToast({
        title: "请求超时",
        icon: "none",
        duration: 1000
      })
      reject()
      const error_code = err.data.status
      this._showError(error_code)
    }
    })
  }

  _showError(error_code) {
    wx.showToast({
      title: tips[error_code],
      icon: "none",
      duration: 1500
    })
}

_showErrMsg(err){
  wx.showToast({
    title: err.msg,
    icon: "none",
    duration: 1500
  })
}


  search({url,data={},method='GET'}){
  return new Promise((resolve,reject)=>{
  this._search(url,resolve,reject,data,method)
  })
  }
  _search(url,resolve,reject,data={},method='POST'){ //private函数
    wx.request({
      url: config.search_url + url,
      dataType:'jsonp',
      jsonp: 'json.wrf',
      method:method,
      data:data,
      header:{
        contentType: "application/json"
      },
    success:(res)=>{
      let jsonData = JSON.parse(res.data)
      resolve(jsonData)
      },
      fail:(err)=>{
        wx.hideLoading()
        wx.showToast({
          title: "请求超时",
          icon: "none",
          duration: 1000
        })
        reject()
        console.log(err)
      }
      })
    }
  
}

export { HTTP };