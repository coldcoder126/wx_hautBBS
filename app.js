//app.js
import {UserModel} from 'models/UserModel'
import {ImageUtils} from 'utils/imageUtils'

const userModel = new UserModel()
const imgUtil = new ImageUtils()
App({
  onLaunch: function () {
    if(!wx.getStorageSync("token")){
      wx.setStorageSync("token","token_123")
    }
    let that = this 
    // 展示本地存储能力
    console.log("onlaunch")
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) { //如果用户已经授权,标记设置为true
          console.log("已授权")
          this.globalData.authorized = true
          let result = userModel.getUserInfo()
          result.then(res=>{          //尝试获取用户的数据，如果成功说明token可用
            console.log(res)
            if(res.status == 401){    //说明token已经失效，需要重新获取
              wx.login({
                success: res => {
                  console.log(res)
                  const tokenPromise = userModel.getToken(res.code)
                  tokenPromise.then(res2 => {

                    if(res2){
                      wx.setStorageSync("token", res2.token)
                      wx.setStorageSync("sessionKey",res2.sessionKey)
                      that.globalData.hasLogin=true
                    console.log("token最新可用2")
                    }
                    let result = userModel.getUserInfo()    //获取完token之后再获取用户信息并存入token
                    result.then(suc=>{
                      wx.setStorageSync("userInfo",suc)
                      wx.setStorageSync("score",suc.score)
                      let avatarUrl = imgUtil.getAvatarUrl(suc.avatarUrl)
                      avatarUrl = imgUtil.getSmallImg(avatarUrl)
                      wx.setStorageSync("avatarUrl",avatarUrl)
                    })
                    
                  })
                }, fail: err => {
                  console.log("登录出错")
                  wx.showToast({
                    title: '登录出错',
                    icon: 'none',
                    duration: 1500
                  })
                }
              })
            }else{                                      //获取用户信息成功，当前token可用，存入缓存
              console.log("token最新可用1")
              wx.setStorageSync("userInfo",res)
              wx.setStorageSync("score",res.score)
              that.globalData.hasLogin=true
              let avatarUrl = imgUtil.getAvatarUrl(res.avatarUrl)
              avatarUrl = imgUtil.getSmallImg(avatarUrl)
              wx.setStorageSync("avatarUrl",avatarUrl)
            }
          },
          fail=>{
            console.log("登录失败辽")
          }
          )

        }
      }
    })

  },
  onShow(options) {
    // Do something when show.
    console.log("onshow")
  },
  globalData: {
    authorized: false,
    hasLogin:false
  }
})