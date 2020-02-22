// pages/topic_detail/common_detail/common_detail.js
import {
  CommentModel
} from '../../../models/CommentModel.js'

import{
  TopicModel
} from '../../../models/TopicModel.js'

const topicModel = new TopicModel()
const commentModel = new CommentModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topicDetail: {},
    canRequestComments: false,
    result:[],
    ownerResult:[],
    commentList: [],
    pageNum:1,
    hasNext:true,
    loading:false,
    inputValue:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    // 接收组件传来的topicDetail
    let topicObj = JSON.parse(options.topicDetailStr)
    let result = new Array()
    if (topicObj.basicUser) {
      console.log("是个Vo")
      //如果传入的是topicListVo则只需加载评论
      result.unshift(0)
      result.unshift("发帖人")
      result.unshift(topicObj.basicUser.uid)
      this.setData({
        topicDetail: topicObj,
        result,
        ownerResult:result,
        canRequestComments: true
      })

      if (this.data.canRequestComments) {
        //确保数据已经传过来
        const allComments = commentModel.getAllComments(this.data.topicDetail.id,this.data.pageNum)
        allComments.then(suc => {
          wx.hideLoading()
          console.log(suc)
          this.setData({
            commentList: suc.list,
            hasNext:suc.hasNextPage,
            pageNum:this.data.pageNum + 1,
            loading:false
          })
        })
      }
    } else {
      // 否则要去服务器请求TopicListVo和评论，两个可以异步
      topicModel.getTopicVoByid(topicObj.id).then(suc=>{
        console.log(suc)
        let pId = 0
        result.push(suc.basicUser.uid)
        result.push(suc.basicUser.nickName)
        result.push(pId)
        this.setData({
          topicDetail:suc,
          result
        })
      })
      //取得评论
      commentModel.getAllComments(topicObj.id,this.data.pageNum).then(suc=>{
        wx.hideLoading()
        this.setData({
          commentList: suc.list,
          hasNext:suc.hasNextPage,
          pageNum:this.data.pageNum + 1,
          loading:false
        })
      })

    }

    console.log("result:"+this.data.result)

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
    wx.showLoading({
      title: '正在刷新',
      mask:true
    })
commentModel.getAllComments(this.data.topicDetail.id,1).then(suc => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({
        title: "刷新成功",
        icon: "success",
        duration: 1500
      })
      console.log(suc)
      this.setData({
        commentList: suc.list,
        hasNext:suc.hasNextPage,
        pageNum:2,
        loading:false
      })
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasNext&&!this.data.loading){
      this.setData({
        loading:true
      })
        const Comments =commentModel.getAllComments(this.data.topicDetail.id,this.data.pageNum)
        
        Comments.then(suc=>{
        console.log(suc)
        const tempArray = [...this.data.commentList, ...suc.list]
        this.setData({
          commentList:tempArray,
          pageNum:this.data.pageNum + 1,
          hasNext:suc.hasNextPage,
          loading:false
        })
      })
      console.log("上拉加载评论")
    }

  },
  onReply(event){
    console.log("get点击")
    this.setData({
      result:event.detail
    })
  },
  onSending(event){
    if(wx.getStorageSync('score')<1){
      wx.showToast({
        title: "积分不足",
        icon: "none",
        duration: 1500
      })
    }else{
    //result[uid,nickName,parentid,level,text]
    let res = event.detail
    //如果没有parentid 则为一级评论


    commentModel.publishComment(this.data.topicDetail.id,res[0],res[4],res[3],res[2]).then(suc=>{
      //同步积分
      wx.setStorageSync("score",(wx.getStorageSync("score")-1))

      wx.showToast({
        title: "评论成功",
        icon: "success",
        duration: 1500
      })
      let commentList = this.data.commentList
      let fromuser = wx.getStorageSync('userInfo')
      let toUser = new Object()
      toUser.nickName = res[1]
      toUser.uid = res[0] 
      let tempObj = new Object()
      tempObj.content = res[4]
      tempObj.createTime = new Date().getTime()
      tempObj.fromUser = fromuser
      tempObj.toUser = toUser
      tempObj.parentId = res[2]
      console.log("tempObj")
      console.log(tempObj)

      if(res[2]<1){
        commentList.push(tempObj)
      this.setData({
        inputValue:"",
        commentList
      })
    }else{
      //获取到parentid  遍历一下commentList
      for(let i = 0;i<commentList.length;i++){
        console.log("即将评论二级评论")
        if (commentList[i].id == res[2]){
          commentList[i].childTopicCommentVoList.push(tempObj)
          this.setData({
            inputValue:"",
            commentList
          })
          console.log(this.data.commentList)
        }
      }
    }
    })
    }

  },
  onOwner(){
    this.setData({
      result:this.data.ownerResult
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})