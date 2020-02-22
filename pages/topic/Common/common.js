// pages/topic/Common/common.js
import {TopicModel} from '../../../models/TopicModel.js'
import {MessageModel} from '../../../models/MessageModel'
import {CommentModel} from '../../../models/CommentModel.js'
import {AdminModel} from '../../../models/AdminModel.js'


const topicModel = new TopicModel()
const messageModel = new MessageModel()
const commentModel = new CommentModel()
const adminModel = new AdminModel()
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: 1,
    topicList: [],
    lostFound: [],
    activityList: [],
    topicNum: 2,
    lostFoundNum: 2,
    activityNum: 2,
    hasNext: true,//总控
    topicHasNext:true,
    lostFoundHasNext:true,//分别赋值给总控
    activityhasNext:true,
    loading: false,
    searching: false,
    authend: true,
    hasStorage: false,
    isAdmin:false,
    new2:true,
    new3:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在刷新',
      mask: true
    })

    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '正在接收消息'
    })
    let topicStorage = wx.getStorageSync('commonTopic')
    let lostFoundStorage = wx.getStorageSync('Lost&Found')
    let activityStorage = wx.getStorageSync('activity')
    console.log(topicStorage)
    this.setData({
      topicList: topicStorage.list,
    })
    if (!topicStorage) {
      this.setData({
        hasStorage: true
      })
    }

    let newCommom = topicModel.getTopicList(1,1)
    let newLostFound = topicModel.getTopicList(1,2)
    let newActivity = topicModel.getTopicList(1,3)

    newCommom.then(res=>{
      wx.setStorageSync("commonTopic", res);
      this.setData({
        topicList: res.list
      })
      wx.hideLoading();
    },fail=>{
      wx.showToast({
        title: "刷新失败",
        icon: "none",
        duration: 500
      })
    })
    //有新消息右上角会出现标记
    newLostFound.then(res=>{
      if(!lostFoundStorage||res.list[0].id>lostFoundStorage.list[0].id){
        this.setData({
          new2:false
        })
        wx.setStorageSync("Lost&Found", res);
      }
    })
    newActivity.then(
      res=>{
        if(!activityStorage||res.list[0].id>activityStorage.list[0].id){
          this.setData({
            new3:false
          })
          wx.setStorageSync("activity", res);
        }
      })
      //逻辑结束

    //接收全局消息
    const latestMessage = messageModel.getNotification()
     const latestTopicNotification = commentModel.getTopicNotification(1)
     const latestCmoomdityNotification = commentModel.getCommodityNotification(1)
     Promise.all([newCommom,newLostFound,newActivity,latestMessage, latestTopicNotification,latestCmoomdityNotification])
     .then(res => {
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '莲花街100号'
      })
     },fail=>{
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '莲花街100号'
      })
     })
     latestMessage.then(res=>{
      if(res.length>0){
        wx.showTabBarRedDot({
          index:2
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
    if(wx.getStorageSync("admin")){
      this.setData({
        isAdmin:true
      })
    }else{
      this.setData({
        isAdmin:false
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '莲花街100号'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 用户下拉才会请求新的数据
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新',
      mask: true
    })

    const topicList = topicModel.getTopicList(1, this.data.selected)
    topicList.then(res => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: "刷新成功",
        icon: "success",
        duration: 500
      })
      if (this.data.selected == 1) {
        wx.setStorageSync("commonTopic", res);
        this.setData({
          topicList: res.list,
          topicNum:2,
          topicHasNext:res.hasNextPage
        })
      }
      if (this.data.selected == 2) {
        wx.setStorageSync("Lost&Found", res);
        this.setData({
          lostFound: res.list,
          lostFoundNum:2,
          lostFoundHasNext:res.hasNextPage
        })
      }
      if (this.data.selected == 3) {
        wx.setStorageSync("activity", res);
        this.setData({
          activityList: res.list,
          activityNum:2,
          activityhasNext:res.hasNextPage
        })
      }
      this.setData({
        hasStorage: false
      })
      console.log(res)
    })


    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasNext && !this.data.loading) {
      this.setData({
        loading: true
      })

      if (this.data.selected == 1) {
        topicModel.getTopicList(this.data.topicNum, 1).then(res => {
          const tempArray = [...this.data.topicList, ...res.list]
          this.setData({
            topicList: tempArray,
            topicNum: this.data.topicNum + 1,
            hasNext: res.hasNextPage,
            loading: false
          })
        })
      }

      if (this.data.selected == 2) {
        topicModel.getTopicList(this.data.lostFoundNum, 2).then(res => {
          const tempArray = [...this.data.lostFound, ...res.list]
          this.setData({
            lostFound: tempArray,
            lostFoundNum: this.data.lostFoundNum + 1,
            hasNext: res.hasNextPage,
            loading: false
          })

        })
      }

      if (this.data.selected == 3) {
        topicModel.getTopicList(this.data.activityNum, 3).then(res => {
          const tempArray = [...this.data.activityList, ...res.list]
          this.setData({
            activityList: tempArray,
            activityNum: this.data.activityNum + 1,
            hasNext: res.hasNextPage,
            loading: false
          })
        })
      }


    }
  },
  onSearching: function () {
    wx.navigateTo({
      url: '/pages/search/search_topic/index'
    })
    // this.setData({
    //   searching:true
    // })
  },
  onCancel: function () {

    this.setData({
      searching: false
    })
  },
  onPublish() {
    let type = this.data.selected
    if (type == 1 || type == 2) {
      wx.navigateTo({
        url: '/pages/publish/publish_topic/publish_topic?type=' + type
      })
    }

    if (type == 3) {
      wx.navigateTo({
        url: '/pages/publish/publish_activity/publish_activity'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onSet1() {
    let topicStorage = wx.getStorageSync('commonTopic')
    this.setData({
      selected: 1,
      topicList: topicStorage.list,
      authend: true,
      hasNext:true,
      topicNum:2
    })
    if (!topicStorage) {
      this.setData({
        hasStorage: true,
        topicList: null
      })
    }
  },
  onSet2() {
    //切换到失物招领页面。1，从缓存中获取list 2,

    let topicStorage = wx.getStorageSync("Lost&Found")
    this.setData({
      selected: 2,
      lostFound: topicStorage.list,
      authend: true,
      hasNext:true,
      lostFoundNum:2,
      new2:true
    })
    if (!topicStorage) {
      this.setData({
        hasStorage: true,
        lostFound: null
      })
    }
  },
  onSet3() {
    //切换到失物招领页面。1，从缓存中获取list 2,
    if (appInstance.globalData.hasLogin) {
      let authenName = wx.getStorageSync("userInfo").authenName
      if (authenName == null || authenName.trim().length < 1 ) {
        this.setData({
          authend: false
        })
      }
    } else {
      this.setData({
        authend: false
      })
    }
    let topicStorage = wx.getStorageSync("activity")
    this.setData({
      selected: 3,
      activityList: topicStorage.list,
      hasNext:true,
      activityNum:2,
      new3:true
    })
    if (!topicStorage) {
      this.setData({
        hasStorage: true,
        activityList: null
      })
    }
  },
  onDelete(e){
    let tid = e.currentTarget.dataset.id
    console.log(tid)
    let uid = e.currentTarget.dataset.uid
    let title = e.currentTarget.dataset.title
    console.log(uid)

    wx.showActionSheet({
      itemList: ['广告推广', '无意义内容', '违反规定'],
      success (res) {
        let itemList = ['广告推广', '无意义内容', '违反规定']
        let msg="您的帖子"+"#"+title+"#"+"被管理员删除，删除原因可能为："+itemList[res.tapIndex]+"---(来自管理员"+wx.getStorageSync("admin").id+")"
        //1.选择删帖的原因 2.删除此贴 3.用管理员的身份发送一条私信告知原因
        adminModel.deleteTopic(tid).then(suc=>{
          adminModel.noticeOwner(uid,msg).then(suc=>{
            wx.showToast({
              title: "已删除",
              icon: "success",
              duration: 500
            })
          })
        })
        
        
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  }

})