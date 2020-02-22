// pages/topic/commodity/commodity.js
import { CommodityModel } from '../../../models/CommodityModel'
import {AdminModel} from '../../../models/AdminModel.js'

const adminModel = new AdminModel()
const commodityModel = new CommodityModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    commodityList: [],
    pageNum: 1,
    hasNext: true,
    loading: false,
    searching: false,
    hasStorage: false,
    isAdmin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let commodityStorage = wx.getStorageSync('commodity')
    if (!commodityStorage) {
      this.setData({
        hasStorage: true
      })
    }
    this.setData({
      commodityList: commodityStorage.list,
      pageNum: 2
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
    if (!this.data.loading) {
      this.setData({
        loading: true
      })
      const latest = commodityModel.getCommodityList(1)
      latest.then(res => {
        wx.stopPullDownRefresh()
        wx.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 500
        })
        wx.setStorageSync("commodity", res);
        this.setData({
          commodityList: res.list,
          pageNum: 2,
          hasNext:res.hasNextPage,
          loading: false
        })
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉")
    if(this.data.hasNext&&!this.data.loading){
      this.setData({
        loading:true
      })
      const next = commodityModel.getCommodityList(this.data.pageNum)
      next.then(res => {
        const tempArray = [...this.data.commodityList, ...res.list]
        this.setData({
          commodityList:tempArray,
          pageNum:this.data.pageNum + 1,
          hasNext:res.hasNextPage,
          loading:false
        })
    })
  }

  },
  onPublish(){
    wx.navigateTo({
      url: '/pages/publish/publish_commodity/publish_commodity'
    })
  },
  onSearching(){
    wx.navigateTo({
      url:'/pages/search/search_commodity/index'
    }) 
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onDelete(e){
    let tid = e.currentTarget.dataset.id
    console.log(tid)
    let uid = e.currentTarget.dataset.uid
    let description = e.currentTarget.dataset.description
    console.log(uid)

    wx.showActionSheet({
      itemList: ['广告推广', '无意义内容', '违反规定'],
      success (res) {
        let itemList = ['广告推广', '无意义内容', '违反规定']
        let msg="您的帖子"+"#"+description+"#"+"被管理员删除，删除原因可能为："+itemList[res.tapIndex]+"---(来自管理员"+wx.getStorageSync("admin").id+")"
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