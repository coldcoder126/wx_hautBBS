// pages/my/my-notification/notification.js
import {
  CommentModel
} from '../../../models/CommentModel.js'
const commentModel = new CommentModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicNoticeList:{},
    commodityNoticeList:{},
    myTopicComments:{},
    loadNum:1,
    selected:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loadNum:1
    })
    commentModel.getTopicNotification(1).then(res=>{
      this.setData({
        topicNoticeList:res.list
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
    //将所显示页面置为已读
    if(this.data.loadNum==1){
      commentModel.readAllTopicNitification().then(res=>{
        wx.stopPullDownRefresh()
        var topicnoticelist = this.data.topicNoticeList
        for(let i=0;i<topicnoticelist.length;i++){
          topicnoticelist[i].haveRead=true
        }
        this.setData({
          topicNoticeList:topicnoticelist
        })
      })
    }

    if(this.data.loadNum==2){
      commentModel.readAllCommodityNotification().then(res=>{
        wx.stopPullDownRefresh()
        var commocitynoticelist = this.data.commodityNoticeList
        for(let i=0;i<commocitynoticelist.length;i++){
          commocitynoticelist[i].haveRead=true
        }
        this.setData({
          commodityNoticeList:commocitynoticelist
        })
      })
    }

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
  onComment1(){
    this.setData({
      loadNum:1,
      selected:1
    })
    commentModel.getTopicNotification(1).then(res=>{
      this.setData({
        topicNoticeList:res.list
      })
    })
  },

  onComment2(){
    this.setData({
      loadNum:2,
      selected:2
    })
    commentModel.getCommodityNotification(1).then(res=>{
      this.setData({
        commodityNoticeList:res.list
      })
    })
  },

  onComment3(){
    this.setData({
      loadNum:3,
      selected:3
    })
    commentModel.getCommentsFromMe(1).then(res=>{
      this.setData({
        myTopicComments:res.list
      })
    })
  },
  onToTopic(e){
    let tempObj = new Object()
    tempObj.id = e.currentTarget.dataset.tid

    let TopicDetail = JSON.stringify(tempObj)
    wx.navigateTo({
      url:'/pages/topic_detail/common_detail/common_detail?topicDetailStr='+TopicDetail
    }) 
  },
  onToCommodity(e){
    let tempObj = new Object()
    tempObj.id = e.currentTarget.dataset.pid
    // tempObj.basicUserInfoVo=null


    let CommodityDetail = JSON.stringify(tempObj)
    wx.navigateTo({
      url:'/pages/topic_detail/commodity_detail/commodity_detail?commodityDetailStr='+CommodityDetail
    }) 
  }
})