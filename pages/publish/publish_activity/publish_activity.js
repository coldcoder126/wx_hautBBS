// pages/publish/publish_activity/publish_activity.js
const app = getApp()
var uploadImage = require('../../../utils/uploadFile/uploadFile.js');
var util = require('../../../utils/uploadFile/util.js');
import{TopicModel} from '../../../models/TopicModel.js'
const topicModel = new TopicModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:"",
    beginTime:"",
    endTime:"",
    canChoose:true,
    title:"",
    content:"",
    price:0,
    images:"",
    tempFilePaths:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  bindDateChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindBeginTime: function(e) {
    this.setData({
      beginTime: e.detail.value
    })
  },
  bindEndTime: function(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  onSubmit(event){
    //将活动名称+活动时间+活动地点+主办方连接为字符串并以分号隔开写入title
    //description作为内容
    let title = event.detail.value.title
    let description = event.detail.value.description
    let place = event.detail.value.place
    let sponsor = event.detail.value.sponsor
    let imgs = this.data.images
    let date = this.data.date
    let begin = this.data.beginTime
    let end = this.data.endTime
    let time = date+";"+begin+"-"+end
    let Title = title+";"+time + ";" + place + ";" +sponsor
 
    topicModel.publishCommon(Title,description,imgs,3).then(res=>{
      wx.setStorageSync("score",(wx.getStorageSync("score")-20))
      wx.showToast({
        title: "发布成功",
        icon: "success",
        duration: 1500,
        success(){
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
            },
            1500);
        }
      })

    })
 
  },
  onUpload(){
    let that = this
        wx.chooseImage({
           count: 1, // 默认最多一次选择3张图
           sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
           sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
           success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths;
              var nowTime = util.formatTime(new Date());
  
              that.setData({
                canChoose:false
              })
  
              let imgs = new String("")
              //支持多图上传
              for (var i = 0; i < res.tempFilePaths.length; i++) {
                 //显示消息提示框
                 wx.showLoading({
                    title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
                    mask: true
                 })
    
                 //上传图片
                 //你的域名下的/hautbbs文件下的/当前年月日文件下的/图片.png
                 //图片路径可自行修改
                 uploadImage(res.tempFilePaths[i], 'hautbbs/topic/'+ nowTime +"/",
                    function (result) {
                      imgs = imgs.concat(result.substring(60,result.length).concat(";"))  //相对地址，要存入数据库
                      that.setData({
                        tempFilePaths,
                          images:imgs
                      })
                       console.log("======上传成功图片地址为：", result);
                       wx.hideLoading();
                    }, function (result) {
                       console.log("======上传失败======", result);
                       wx.hideLoading()
                    }
                 )
              }
           }
        })
  }
})