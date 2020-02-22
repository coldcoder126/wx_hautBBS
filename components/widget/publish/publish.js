import { UserModel } from "../../../models/UserModel";
const userModel = new UserModel()

// components/publish/publish.js
Component({
  lifetimes: {

  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFirst: false,
    userInfo: {},
    hasLogin: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //onPublish场景：未登录
    onPublish() {
      console.log(this.data.isFirst)
      const appInstance = getApp()
      let hasLogin = appInstance.globalData.hasLogin
      console.log("hasLogin")
      console.log(hasLogin)
      if (!hasLogin) {
        wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1500
        })
      }
      else if(wx.getStorageSync("userInfo").phone==null||wx.getStorageSync("userInfo").phone<1){
        this.setData({
          isFirst: true
        })
      }else if(wx.getStorageSync("score") < 20) {
        wx.showToast({
          title: "积分不足",
          icon: "none",
          duration: 1500
        })
      } else if (this.data.userInfo.status > 0) {
        wx.showToast({
          title: "你已被禁言",
          icon: "none",
          duration: 1500
        })
      } else {
        this.triggerEvent('publish', {}, {})
      }
    },
    getPhoneNumber(e) {
      console.log(e)
      let encryptedData = e.detail.encryptedData
      let iv = e.detail.iv
      let that = this
      if(iv){
        //点击允许才执行
      console.log("getphoneNum")
      wx.checkSession({
        success() {
          let sessionkey = wx.getStorageSync("sessionKey")
          userModel.getPhoneNumber(encryptedData, sessionkey, iv).then(suc => {
            let userinfo = new Object()
            userinfo = wx.getStorageSync("userInfo")
            userinfo.phone = 12345
            wx.setStorageSync("userInfo", userinfo)
            that.setData({
              isFirst: false
            })
          })
          console.log("session_key 未过期，并且在本生命周期一直有效")
          // wx.setStorageSync("userInfo",wx.getStorageSync("userInfo").phone=12345)
        },
        fail() {
          console.log("session_key 已经失效，需要重新执行登录流程")
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success: res => {
              console.log("res")
              console.log(res)
              UserModel.getPhoneNumber(encryptedData, res.code, iv).then(
                res2 => {
                  let userinfo = new Object()
                  userinfo = wx.getStorageSync("userInfo")
                  userinfo.phone = 12345
                  wx.setStorageSync("userInfo", userinfo)
                  that.setData({
                    isFirst: false
                  })

                }
              )
            }
          })
        }
      })
    }else{
      this.setData({
        isFirst:false
      })
    }
      console.log(this.data.isFirst)
    }


  }
})
