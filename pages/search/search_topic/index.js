// pages/search/search_topic/index.js
import { SearchHistory } from '../../../models/SearchHistory'
import {SearchModel} from '../../../models/SearchModel'
const searchHistory = new SearchHistory()
const searchModel = new SearchModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyWords: [],
    topicList: {},
    keyWord:'',
    startNum: 10,
    loading: false,
    numFound: -1,
    type:['交流区','失物招领','活动'],
    typeIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const historyWords = searchHistory.getTopicHistory();
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
      const topicList = searchModel.searchTopic(type,keyWord,startNum)
      topicList.then(res => {
        const tempArray = [...this.data.topicList, ...res.response.docs]
        this.setData({
          topicList: tempArray,
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
    let type = parseInt(this.data.typeIndex)+1
    console.log(type)
    searchModel.searchTopic(type,keyWord,0).then(
      suc=>{
        console.log(suc)
          this.setData({
            topicList:suc.response.docs,
            numFound:suc.response.numFound
          })
          searchHistory.addTotopicHistory(keyWord)
      }
    )
    // topicModel.searchTopic(this.data.pageNum, keyWord,type).then(suc => {
    //   if(suc.size>0){
    //   this.setData({
    //     topicList: suc.list,
    //     pageNum:this.data.pageNum +1,
    //     hasNext:suc.hasNextPage,
    //     keyWord,
    //     none:false
    //   })
    //   console.log(suc)
    // }else{
    //   this.setData({
    //     none:true
    //   })
    // }
    // searchHistory.addTotopicHistory(this.data.keyWord)
    // })
  },
  onDelete(event){
    this.setData({
      topicList:{},
      numFound:0
    })
  }, 
  bindPickerChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
    console.log(e.detail.value)
  },
  delHistory(event){
    wx.removeStorageSync('topic_search_history')
    this.setData({
      historyWords:[]
    })
  }

})