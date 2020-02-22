// pages/my/message/message.js
import {MessageModel} from '../../../models/MessageModel'
import{messageUtil} from '../../../utils/messageUtil.js'

const messageModel = new MessageModel()
const msgUtil = new messageUtil()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: 0, //开始坐标
    startY: 0,
    toUser:{},
    messageUserList:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从缓存中取
    messageModel.getNotification().then(res=>{

      if(res.length>0){
      for(let i=0 ;i<res.length;i++){
        let obj = new Object()
        obj = res[i]
        msgUtil.updateCache(obj)
      }
    }
    this.setData({
      messageUserList:wx.getStorageSync('msgUserList')
    })
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
    this.setData({
      messageUserList:wx.getStorageSync('msgUserList')
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

    wx.showLoading({
      title: '正在刷新',
      mask:true
    })

    messageModel.getNotification().then(res=>{
      wx.stopPullDownRefresh()
      if(res.length>0){
      for(let i=0 ;i<res.length;i++){
        let obj = new Object()
        obj = res[i]
        msgUtil.updateCache(obj)
      }
    }
    this.setData({
      messageUserList:wx.getStorageSync('msgUserList')
    })
    wx.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 500
    })
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
  onChat(e){

    let fromuid =  e.currentTarget.dataset.fid
    let index =  e.currentTarget.dataset.index
    let obj = new Object()
    obj.fromUid = fromuid
    obj.index = index
    let strObj = JSON.stringify(obj)



    wx.navigateTo({
      url:'/pages/my/msg-detail/msg-detail?Obj='+strObj
    }) 

  },
  onDelete(e){
    let index = e.currentTarget.dataset.index
    let messageUserList = this.data.messageUserList
    messageUserList.splice(index, 1)
    this.setData({
      messageUserList
    })
    wx.setStorageSync('msgUserList', messageUserList);

  },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.messageUserList.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
    v.isTouchMove = false;
    })
    this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    messageUserList: this.data.messageUserList
    })
    },
    //滑动事件处理
    touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.messageUserList.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
    if (touchMoveX > startX) //右滑
    v.isTouchMove = false
    else //左滑
    v.isTouchMove = true
    }
    })
    //更新数据
    that.setData({
      messageUserList: that.data.messageUserList
    })
    },
    /**
    * 计算滑动角度
    * @param {Object} start 起点坐标
    * @param {Object} end 终点坐标
    */
    angle: function (start, end) {
    var _X = end.X - start.X,
    _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },

})