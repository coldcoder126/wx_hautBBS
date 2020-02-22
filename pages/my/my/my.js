// pages/my/my.js
var uploadImage = require('../../../utils/uploadFile/uploadFile.js');
var util = require('../../../utils/uploadFile/util.js'); 
const appInstance = getApp()
import { UserModel } from '../../../models/UserModel.js'
import { ImageUtils } from '../../../utils/imageUtils'
import { CommentModel } from '../../../models/CommentModel.js'
import { TimeUtil } from '../../../utils/timeUtil'
import { MessageModel } from '../../../models/MessageModel'


const userModel = new UserModel()
const commentModel = new CommentModel()
const timeUtil = new TimeUtil()
const imgUtil = new ImageUtils()
const messageModel = new MessageModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: true,
    userInfo: {},
    score: 0,
    avatarUrl:'',
    OriginAvatar: "",
    done: false,
    signed: true,
    haveNotification: false,
    haveMessage: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    //页面初始化的时候判断用户是否授权,没有授权则显示登录按钮。已授权则重新获取userinfo刷新一下
    let hasAuthorized = appInstance.globalData.authorized
    let hasLogin = appInstance.globalData.hasLogin
    if(!hasAuthorized){
      //如果全局变量未登录并且缓存中也没有用户信息才是真的未登录。防止用户没网导致的未登录情况
    this.setData({
      authorized: false
    })
    }
    if(!hasLogin&&hasAuthorized){
      this._getToken()
    }
    let userInfo = wx.getStorageSync("userInfo")
    let avatarUrl = wx.getStorageSync("avatarUrl")
    let OriginAvatar = imgUtil.getAvatarUrl(userInfo.avatarUrl)
    let signed = timeUtil.isToday(this.data.userInfo.signTime)

    this.setData({
      userInfo,
      avatarUrl,
      signed: timeUtil.isToday(wx.getStorageSync("userInfo").signTime),
      OriginAvatar,
      score: userInfo.score
    })

    const latestMessage = messageModel.getNotification()
    const latestTopicNotification = commentModel.getTopicNotification(1)
    const latestCmoomdityNotification = commentModel.getCommodityNotification(1)
    Promise.all([latestMessage, latestTopicNotification, latestCmoomdityNotification])
      .then(res => {
      })



    latestMessage.then(res => {
      if (res.length > 0) {
        this.setData({
          haveMessage: true
        })
      }
    })

    latestCmoomdityNotification.then(res => {
      if(!res.list[0]){
      }
      else if(!res.list[0].haveRead) {
        console.log(res)
        this.setData({
          haveNotification: true
        })
      }
    })

    latestTopicNotification.then(res => {
      if(!res.list[0]){
      }
      else if (!res.list[0].haveRead) {
        this.setData({
          haveNotification: true
        })
      }
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
    //更新分数和userInfo
    this.setData({
      score: wx.getStorageSync("score"),
      userInfo:wx.getStorageSync("userInfo")
    })
    wx.hideTabBarRedDot({
      index: 2
    })
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
  onGetUserInfo: function (event) {
    //当用户点击授权的时候将用户的昵称性别国家省份获取到，分配默认头像，因为头像Url无法解析
    //性别，国家，省份，城市跟随微信
    let userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        authorized: true,
        userInfo: userInfo
      })
      var app = getApp()
      app.globalData.hasLogin = true

      //去服务器注册一下
      this.loginAndGetInfo()
    }
  },
  loginAndGetInfo() {
    let that = this
    //登陆并获取用户的信息
    wx.login({
      success: res => {
        wx.showLoading({
          title: '正在登录',
          mask: true
        })
        wx.setStorageSync("wxcode",res.code)
        const tokenPromise = userModel.getToken(res.code)
        tokenPromise.then(res2 => {
          console.log(res2)
          wx.setStorageSync("token", res2.token)
          wx.setStorageSync("sessionKey",res2.sessionKey)
          if(res2.first){
          wx.getUserInfo({
            success(res) {
              let user = res.userInfo
              userModel.firstUpdate(user.nickName, user.gender, "", user.country, user.province, user.city).then(suc => {
                wx.showLoading({
                  title: '正在获取信息',
                  mask: true
                })
              },
                fail => {
                  console.log("err1")
                }
              )
              console.log(user)
              wx.setStorageSync("avatarUrl", user.avatarUrl)
              let avatarUrl = user.avatarUrl
              that.setData({
                avatarUrl,
                score:200
              })
              // 1.下载用户头像，2将用户头像后上传到服务器
              wx.downloadFile({
                url: avatarUrl, 
                success(res) {
                  wx.showLoading({
                    title: '正在获取头像',
                    mask: true
                  })
                  // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                  if (res.statusCode === 200) {
                    var nowTime = util.formatTime(new Date());
                    uploadImage(res.tempFilePath, 'hautbbs/avatar/' + nowTime + "/",
                      function (result) {
                        wx.showLoading({
                          title: '正在上传头像',
                          mask: true
                        })
                        let img = result.substring(61, result.length)  //相对地址，要存入数据库

                        userModel.updateAvatar(img).then(res => {     //如果更新成功，更新一下缓存信息
                          console.log("登录成功")
                          wx.showToast({
                            title:'登录成功',
                            icon:'success',
                            duration:1000
                          })
                        })
                        wx.hideLoading();
                      }, function (result) {
                        
                        wx.showToast({
                          title: '获取头像失败',
                          icon: 'none',
                          duration: 1000,
                        });
                      }
                    )
                  }
                }
              })

              // 结束上传图片到服务器
            }
          })
          }else{
            userModel.getUserInfo().then(res => {
              wx.setStorageSync("userInfo", res)
              wx.setStorageSync("score", res.score)
              let avatarUrl = imgUtil.getAvatarUrl(res.avatarUrl)
              avatarUrl = imgUtil.getSmallImg(avatarUrl)
              wx.setStorageSync("avatarUrl", avatarUrl)
        
              that.setData({
                userInfo: res,
                score: res.score,
                avatarUrl: avatarUrl,
                signed: timeUtil.isToday(res.signTime)
              })
        
            })
            wx.hideLoading();
          }
          

        }, fail => {
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 500
          })
        })
      },
      fail: function (res) {
        return 0
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //1.刷新用户信息2.刷新通知3.刷新私信
    wx.showLoading({
      title: '正在刷新',
      mask: true
    })
    const latestInfo = userModel.getUserInfo()
    const latestMessage = messageModel.getNotification()
    const latestTopicNotification = commentModel.getTopicNotification(1)
    const latestCmoomdityNotification = commentModel.getCommodityNotification(1)
    Promise.all([latestInfo, latestMessage, latestTopicNotification, latestCmoomdityNotification])
      .then(res => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 500
        })
      })

    latestInfo.then(res => {
      wx.setStorageSync("userInfo", res)
      wx.setStorageSync("score", res.score)
      let avatarUrl = imgUtil.getAvatarUrl(res.avatarUrl)

      if(res.avatarUrl==null||res.avatarUrl.trim().length==0){
        avatarUrl = 'noAvatar.png'
      }

      avatarUrl = imgUtil.getSmallImg(avatarUrl)
      wx.setStorageSync("avatarUrl", avatarUrl)


      this.setData({
        userInfo: res,
        score: res.score,
        avatarUrl: avatarUrl,
        signed: timeUtil.isToday(res.signTime)
      })

    }, fail => {
      console.log("获取用户信息失败")
    })

    latestMessage.then(res => {
      if (res.length > 0) {
        this.setData({
          haveMessage: true
        })
      }
    })

    latestCmoomdityNotification.then(res => {
      if(!res.list[0]){
      }
      else if (!res.list[0].haveRead) {
        this.setData({
          haveNotification: true
        })
      }
    })

    latestTopicNotification.then(res => {
      if(!res.list[0]){}
      else if (!res.list[0].haveRead) {
        this.setData({
          haveNotification: true
        })
      }
    })



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
  onSign() {
    //签到，点击之后随机加分3-10
    if (wx.getStorageSync("userInfo").status > 0) {
      wx.showToast({
        title: "你已被禁言",
        icon: "none",
        duration: 1500
      })
    } else {
      let score=wx.getStorageSync('score')
      let addScore=0
      if(score<100){ //100分以下签到分值在10-14
        addScore = Math.ceil(Math.random() * 5) + 10
      }else if(score<300){ //200-300签到分值在7-12
        addScore = Math.ceil(Math.random() * 4) + 7
      }else{
        addScore = Math.ceil(Math.random() * 5) + 4 
      }
      userModel.sign(addScore).then(res => {
        
        this.setData({
          signed: true,
          score: score + addScore
        })

        wx.showToast({
          title: '+' + addScore + '分',
          icon: 'success',
          duration: 1500
        })
        wx.setStorageSync("score", (wx.getStorageSync("score") + addScore))
      })
    }
  },
  onMyInfo() {
    wx.navigateTo({
      url: '/pages/my/my-info/my-info'
    })
  },
  onMyTopic() {
    wx.navigateTo({
      url: '/pages/my/my-topic/my-topic'
    })
  },
  onMyNotification() {
    this.setData({
      haveNotification:false
    })
    wx.navigateTo({
      url: '/pages/my/my-notification/notification'
    })

  },
  onMessage() {
    this.setData({
      haveMessage: false
    })
    wx.navigateTo({
      url: '/pages/my/message/message'
    })
  },
  onAbout(){
    wx.navigateTo({
      url: '/pages/my/about/about'
    })
  },
  onPreview() {
    wx.previewImage({
      current: this.data.OriginAvatar,
      urls: [this.data.OriginAvatar]
    })
  },
  _getToken(){
    wx.login({
      success: res => {
        console.log(res)
        const tokenPromise = userModel.getToken(res.code)
        tokenPromise.then(res2 => {
          wx.setStorageSync("token", res2.token)
          wx.setStorageSync("sessionKey",res2.sessionKey)
          let result = userModel.getUserInfo()    //获取完token之后再获取用户信息并存入token
          result.then(suc=>{
            wx.setStorageSync("userInfo",suc)
            wx.setStorageSync("score",suc.score)
            let avatarUrl = imgUtil.getAvatarUrl(res.avatarUrl)
            avatarUrl = imgUtil.getSmallImg(avatarUrl)
            wx.setStorageSync("avatarUrl",avatarUrl)
          })
          
        })
      }
    })
  }
})