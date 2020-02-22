// pages/my/my-topic/my-topic.js

 
import { CommodityModel } from '../../../models/CommodityModel'
const commodityModel = new CommodityModel()
import {TopicModel} from '../../../models/TopicModel.js'
const topicModel = new TopicModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    startX: 0, //开始坐标
    startY: 0,
    page:1,
    simpleTopicList: {},
    commodityList:{},
    pageNum: 1,
    loading: false,
    hasNext: false,
    selected:1

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //在第一个页面时加载帖子
    let topicList = topicModel.getTopicListByUid(1,0)
    topicList.then(res => {

      this.setData({
        simpleTopicList: res.list,
        hasNext: res.hasNextPage,
        pageNum:2
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.selected==1){
    if(!this.data.loading&&this.data.hasNext){
      this.setData({
        loading:true
      })

      let topicList = topicModel.getTopicListByUid(this.data.pageNum,0)
      topicList.then(res => {

        let tempList = [...this.data.simpleTopicList, ...res.list]

        this.setData({
          hasNext: res.hasNextPage,
          pageNum:this.data.pageNum+1,
          loading:false,
          simpleTopicList:tempList
        })
      })
    }
  }else{
    if(!this.data.loading&&this.data.hasNext){
      this.setData({
        loading:true
      })

      let topicList = topicModel.getCommodityListByUid(this.data.pageNum,0)
      topicList.then(res => {

        let tempList = [...this.data.simpleTopicList, ...res.list]

        this.setData({
          hasNext: res.hasNextPage,
          pageNum:this.data.pageNum+1,
          loading:false,
          commodityList:tempList
        })
      })
    }
  }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onFirst(){
    this.setData({
      page:1,
      selected:1
    })
  },
  onSecond(){
    this.setData({
      page:2,
      selected:2
    })
    let commodityList = commodityModel.getCommodityListByUid(1,0)
    commodityList.then(res=>{
      this.setData({
        commodityList:res.list,
        hasNext:res.hasNextPage,
        pageNum:2
      })
    })
  },
      //删除事件
      onDelete: function (e) {
        let that = this
        let tid = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        wx.showModal({
          title: '提示',
          content: '此帖及其下所有评论将被删除',
          success(res) {
            if (res.confirm) {
              topicModel.deleteTopic(tid).then(res=>{
                that.data.simpleTopicList.splice(index, 1)
                that.setData({
                  simpleTopicList:that.data.simpleTopicList
                })
              })
            } else if (res.cancel) {
              
            }
          }
        })
  
      },
      onDelete2(e){
        //删除商品的操作
        let that = this
        let tid = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        wx.showModal({
          title: '提示',
          content: '此帖及其下所有评论将被删除',
          success(res) {
            if (res.confirm) {
              commodityModel.deleteCommodity(tid).then(res=>{
                that.data.commodityList.splice(index, 1)
                that.setData({
                  commodityList:that.data.commodityList
                })
              })
            } else if (res.cancel) {
              
            }
          }
        })
      },
      onSaled(e){
        //将商品设为已售
        let id = e.currentTarget.dataset.id
        let index = e.currentTarget.dataset.index
        commodityModel.setSaled(id).then(res=>{
          this.data.commodityList[index].status = 1
          this.setData({
            commodityList:this.data.commodityList
          })
          wx.showToast({
            title: "置为已售",
            icon: "success",
            duration: 500
          })
        })


      },
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.simpleTopicList.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
    v.isTouchMove = false;
    })
    this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    simpleTopicList: this.data.simpleTopicList
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
    that.data.simpleTopicList.forEach(function (v, i) {
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
    simpleTopicList: that.data.simpleTopicList
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
    touchstart2: function (e) {
      //开始触摸时 重置所有删除
      this.data.commodityList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
      v.isTouchMove = false;
      })
      this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      commodityList: this.data.commodityList
      })
      },
      //滑动事件处理
      touchmove2: function (e) {
      var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      that.data.commodityList.forEach(function (v, i) {
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
        commodityList: that.data.commodityList
      })
      }
})