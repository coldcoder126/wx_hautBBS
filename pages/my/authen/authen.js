// pages/my/authen/authen.js
import { UserModel } from '../../../models/UserModel.js'
const userModel = new UserModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    authen_txt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo:wx.getStorageSync("userInfo")
    })
    let that = this
    wx.downloadFile({
      url: "https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/system/authen.txt", 
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.getFileSystemManager().readFile({
            filePath:res.tempFilePath,
                   encoding:'utf-8',
                   success: res => {
                    that.setData({
                      authen_txt:res.data
                    })
                    
                   },
                   fail: err=>{
                     wx.showToast({
                       title:'文件未加载',
                       icon: 'none',
                       duration: 1000
                     })
                   }
                  })
        }

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
  onSubmit(event){
    let stuid = event.detail.value.stuid
    let pwd = event.detail.value.pwd
    let that = this
    wx.request({
      url: 'http://portal.haut.edu.cn/portal-pc/login/authentication', 
      data: {
        username: stuid,
        password: pwd
      },
      header: {
        'content-type': 'application/json' 
      },
      success (res) {
        console.log(res)
        if(res.data.obj.success){
          //将用户的学/工号更新 1.如果stuid是12位则为学生，否则为教工
          userModel.updateStuid(stuid).then(suc=>{
            wx.showToast({
              title: '已绑定',
              icon: 'success',
              duration: 1000
            })
            let userInfo = that.data.userInfo
            userInfo.stuid=stuid
            that.setData({
              userInfo
            })
            }
          )
        }else{
          wx.showToast({
            title: '用户名或密码错误',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  }
})