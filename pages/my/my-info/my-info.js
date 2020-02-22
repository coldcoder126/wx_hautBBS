// pages/my/my-info/my-info.js
var uploadImage = require('../../../utils/uploadFile/uploadFile.js');
var util = require('../../../utils/uploadFile/util.js');

import { UserModel } from '../../../models/UserModel.js'
import { AdminModel } from '../../../models/AdminModel.js'

const adminModel = new AdminModel()
const userModel = new UserModel()

import { ImageUtils } from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: "",
    isAdmin: false,
    isLogin: false,
    modifyName: false,
    modifyDescp: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo")
    let avatarUrl = imgUtil.getAvatarUrl(userInfo.avatarUrl)
    avatarUrl = imgUtil.getSmallImg(avatarUrl)
    this.setData({
      userInfo,
      avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getStorageSync("admin")) {
      this.setData({
        isLogin: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onSubmit(event) {
    let nickName = event.detail.value.nickName.trim()
    let description = event.detail.value.description.trim()
    if (nickName == "guangyustudio") {
      this.setData({
        isAdmin: true
      })
    } else if(nickName.length<1){
      wx.showToast({
        title: "昵称不可为空",
        icon: "none",
        duration: 1500
      })
    }else if(nickName != this.data.userInfo.nickName) {
      //如果昵称改动
      this.setData({
        modifyName: true
      })
    } if (description != this.data.userInfo.description) {
      //如果描述改动
      this.setData({
        modifyDescp: true
      })
    }

    let that = this
    setTimeout(function () {
      let modifyName = that.data.modifyName
      let modifyDescp = that.data.modifyDescp
      if (modifyName && !modifyDescp) {
        userModel.updateNickName(nickName).then(suc => {
          if (suc == null) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500
            )
          }
        }, fail => {
          wx.showToast({
            title: "修改失败",
            icon: "none",
            duration: 1500
          })
        })
      }else if(modifyDescp && !modifyName){
        userModel.updateDescription(description).then(suc => {
          if (suc == null) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500
            )
          }
        }, fail => {
          wx.showToast({
            title: "修改失败",
            icon: "none",
            duration: 1500
          })
        })
      }else if(modifyDescp&&modifyName){
        userModel.updateNicknameAndDescp(nickName,description).then(suc => {
          if (suc == null) {
            wx.showToast({
              title: "修改成功",
              icon: "success",
              duration: 1500
            })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500
            )
          }
        }, fail => {
          wx.showToast({
            title: "修改失败",
            icon: "none",
            duration: 1500
          })
        })
      }
    }, 300)
},
  onAuthen(){
    wx.navigateTo({
      url: '/pages/my/authen/authen'
    })
  },
  onMask(){
    this.setData({
      isAdmin: false
    })
  },
  onAdminLogin(e){
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    let account = e.detail.value.account.trim()
    let pwd = e.detail.value.password.trim()

    adminModel.adminLogin(account, pwd).then(suc => {
      console.log(suc)
      if (suc) {
        wx.hideLoading()
        this.setData({
          isAdmin: false,
          isLogin: true
        })
        wx.setStorageSync("admin", suc)
        wx.showToast({
          title: "登录成功",
          icon: "success",
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000
        )
      }
      console.log(suc)
    }, fail => {
      wx.hideLoading()
      console.log("请检查网络")
    })
  },
  switchChange(e){
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
    if(!e.detail.value){
  wx.removeStorage({
    key: 'admin'
  })
  this.setData({
    isLogin:false
  })
}
  },
onUpload() {
  let that = this
  wx.chooseImage({
    count: 1, // 默认最多一次选择3张图
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePaths = res.tempFilePaths;
      var nowTime = util.formatTime(new Date());

      that.setData({
        canChoose: false
      })

      //支持多图上传
      for (var i = 0; i < res.tempFilePaths.length; i++) {
        //显示消息提示框
        wx.showLoading({
          title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
          mask: true
        })

        //上传图片
        //你的域名下的/hautbbs文件下的/当前年月日文件下的/图片.png
        //图片路径可自行修改
        uploadImage(res.tempFilePaths[i], 'hautbbs/avatar/' + nowTime + "/",
          function (result) {
            let img = result.substring(61, result.length)  //相对地址，要存入数据库
            userModel.updateAvatar(img).then(res => {     //如果更新成功，更新一下缓存信息
              let userInfo = userModel.getUserInfo()
              wx.setStorageSync("userInfo", userInfo)
            })

            that.setData({
              avatarUrl: tempFilePaths[0]
            })
            console.log("======上传成功图片地址为：", result);
            wx.hideLoading();
          }, function (result) {
            console.log("======上传失败======", result);
            wx.hideLoading()
          }
        )
      }
    }
  })
}
})