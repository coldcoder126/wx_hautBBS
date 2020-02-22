// pages/search/search_commodity/index.js
import { SearchHistory } from '../../../models/SearchHistory'
import {CommodityModel} from '../../../models/CommodityModel'
import {SearchModel} from '../../../models/SearchModel'

const searchHistory = new SearchHistory()
const commodityModel = new CommodityModel()
const searchModel = new SearchModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyWords: [],
    commodityList: {},
    keyWord:'',
    loading: false,
    numFound: -1,
    startNum: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const historyWords = searchHistory.getCommodityHistory();
    this.setData({
      historyWords
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
    if (this.data.numFound-this.data.startNum>0 && !this.data.loading) {
      let startNum = this.data.startNum+10
      this.setData({
        loading: true,
        startNum
      })
      const commodities =SearchModel.searchCommodity(this.data.keyWord,this.data.startNum)
      commodities.then(res => {
        const tempArray = [...this.data.commodityList, ...res.response.docs]
        this.setData({
          commodityList: tempArray,
          loading: false
        })
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onConfirm(event) {
    console.log("okok")
    const keyWord = event.detail

    searchModel.searchCommodity(keyWord,0).then(
      suc=>{
        console.log(suc)
        this.setData({
          commodityList:suc.response.docs,
          numFound:suc.response.numFound
        })
        searchHistory.addTocommodityHistory(keyWord)
      }
    )

  },
  onDelete(event){
    this.setData({
      topicList:{},
      numFound:0
    })
  },
  delHistory(event){
    wx.removeStorageSync('commdity_search_history')
    this.setData({
      historyWords:[]
    })
  }
})