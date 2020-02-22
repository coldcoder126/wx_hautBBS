// pages/topic_detail/activity_detail/activity_detail.js
import {ImageUtils} from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    date:"",
    time:"",
    place:"",
    sponsor:"",
    description:"",
    image:"",
    Origin:"",
    publishTime:"",
    authenName:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Activity = JSON.parse(options.activityDetailStr)
    let authenName = Activity.basicUser.authenName
    let titleStr = Activity.title
      const list = titleStr.split(";")
      let img = Activity.images.split(";")
      img = img[0]
      let Origin = imgUtil.getTopicImgUrl(img)
      let image = imgUtil.getLQImg(Origin)
      let publishTime = Activity.createTime
      console.log(Activity)

      this.setData({
        title:list[0],
        date:list[1],
        time:list[2],
        place:list[3],
        sponsor:list[4],
        description:Activity.content,
        image,
        Origin,
        publishTime,
        authenName
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
  previewImg(){
    console.log("获取到点击")
    wx.previewImage({
      current: this.data.Origin, 
      urls:[this.data.Origin]
    })
  }
})