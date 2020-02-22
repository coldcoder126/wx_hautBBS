// pages/my/msg-detail/msg-detail.js
import {MessageModel} from '../../../models/MessageModel'
import {UserModel} from '../../../models/UserModel'
import {ImageUtils} from '../../../utils/imageUtils'
import{messageUtil} from '../../../utils/messageUtil.js'

const messageModel = new MessageModel()
const userModel = new UserModel()
const imgUtil=new ImageUtils()
const msgUtil = new messageUtil()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAvatar:"",
    currentFromUid:0,
    currentName:"",
    messageList:{},
    pageNum:1,
    myAvatar:"",
    hasNext:false,
    inputVal:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
//1.获取聊天对象的id，2.获取该用户的信息并更新 3. 获取聊天记录 4.将消息置为已读
    let Obj = JSON.parse(options.Obj)
    let fromuid = Obj.fromUid
    let index = Obj.index
    this.setData({
      currentFromUid:fromuid,
      myAvatar:wx.getStorageSync("avatarUrl")
    })

    userModel.getUserInfoById(fromuid).then(res=>{
      let avatarUrl = imgUtil.getAvatarUrl(res.avatarUrl)
      avatarUrl = imgUtil.getSmallImg(avatarUrl)
      this.setData({
        currentAvatar:avatarUrl,
        currentName:res.nickName
      })
    })

    messageModel.getHistory(fromuid,this.data.pageNum).then(res=>{
      //将消息头尾倒序然后赋值给messageList
      let tempList = res.list 
      tempList = tempList.reverse()
      this.setData({
        messageList:tempList,
        pageNum:2,
        hasNext:res.hasNextPage
      })

      messageModel.readAll(fromuid).then(res=>{
        let msgList = msgUtil.getCache()
        msgList[index].haveRead = true
        msgList[index].avatarUrl = this.data.currentAvatar
        this.setData({
          messageUserList:msgList
        })
        msgUtil.setCache(msgList)
      })
    })

    //将缓存中的消息状态置为已读
    let msgCacheList = msgUtil.getCache()
    msgCacheList[index].haveRead = true
    msgUtil.setCache(msgCacheList)
    this.setData({
      msgList:msgCacheList
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
    //下拉显示历史消息
    if(this.data.hasNext){
    messageModel.getHistory(this.data.currentFromUid,this.data.pageNum).then(res=>{
      wx.stopPullDownRefresh()
      let tempList = res.list
      tempList = tempList.reverse()
      const tempArray = [...tempList,...this.data.messageList]
      this.setData({
        messageList:tempArray,
        pageNum:this.data.pageNum+1
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
  onSend(e){
    let content = e.detail
    console.log("input内容")
    console.log(content)
    wx.showLoading({
      title: '正在发送',
      mask:true
    })
    messageModel.send(this.data.currentFromUid,content[4]).then(res=>{
      let tempObj = new Object()
      tempObj.content = content[4]
      tempObj.createTime = new Date().getTime()
      tempObj.haveRead = true;
      tempObj.toUid = this.data.currentFromUid
      console.log(tempObj)


      let list = this.data.messageList
      list.push(tempObj)
      this.setData({
        messageList:list,
        inputVal:""
      })
      wx.showToast({
        title: "已发送",
        icon: "success",
        duration: 500
      })
    })
  }
})