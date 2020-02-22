// pages/topic_detail/commodity_detail/commodity_detail.js
import {
  CommentModel
} from '../../../models/CommentModel.js'
import {
  CommodityModel
} from '../../../models/CommodityModel.js'

const commentModel = new CommentModel()
const commodityModel = new CommodityModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityDetail: {},
    canRequestComments: false,
    ownerResult:[],
    result:[],
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
    let commodityObj = JSON.parse(options.commodityDetailStr)
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    if(commodityObj.basicUserInfoVo){ //如果传来的json中有用户信息
      console.log("有basicuserinfovo")
    let result = new Array()
    result.unshift(0)
    result.unshift("楼主")
    result.unshift(commodityObj.basicUserInfoVo.uid)
    this.setData({
      commodityDetail: commodityObj,
      ownerResult:result,
      result,
      canRequestComments: true
    })

    if (this.data.canRequestComments) {
      //确保数据已经传过来
      const allComments = commentModel.getCommodityComments(this.data.commodityDetail.id,this.data.pageNum)
      allComments.then(suc => {
        wx.hideLoading()
        console.log("评论")
        console.log(suc)
        this.setData({
          commentList: suc.list,
          hasNext:suc.hasNextPage,
          pageNum:this.data.pageNum + 1,
          loading:false
        })
      })
    }
  }else{  //传来的没有用户信息
    commodityModel.getCommodityVoById(commodityObj.id).then(res=>{
      let result = new Array()
      let pId = 0
      result.push(res.basicUserInfoVo.uid)
      result.push("发帖人")
      result.push(pId)
console.log("商品详情请求结果")
console.log(res)
      this.setData({
        commodityDetail:res,
        result
      })

    })

    const allComments = commentModel.getCommodityComments(commodityObj.id,this.data.pageNum)
    allComments.then(suc => {
      wx.hideLoading()
      console.log("评论")
      console.log(suc)
      this.setData({
        commentList: suc.list,
        hasNext:suc.hasNextPage,
        pageNum:this.data.pageNum + 1,
        loading:false
      })
    })

  }

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
    commentModel.getCommodityComments(this.data.commodityDetail.id,1).then(suc => {
      wx.hideLoading()
      wx.showLoading({
        title: '正在刷新',
        mask:true
      })

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
        const Comments =commentModel.getAllComments(this.data.commodityDetail.id,this.data.pageNum)
        
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onReply(event){
    console.log("get点击")
    this.setData({
      result:event.detail
    })
  },
  onOwner(){
    this.setData({
      result:this.data.ownerResult
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
          wx.showLoading({
      title: '正在发送',
      mask:true
    })
        //result[uid,nickName,parentid,level,text]
        let res = event.detail
        console.log(res)
        commentModel.publishCommodityComment(this.data.commodityDetail.id,res[0],res[4],res[3],res[2]).then(suc=>{
          wx.hideLoading()
          wx.showToast({
            title: "评论成功",
            icon: "success",
            duration: 1500
          })

          wx.setStorageSync("score",(wx.getStorageSync("score")-1))
          this.setData({
            inputValue:""
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

  }
})