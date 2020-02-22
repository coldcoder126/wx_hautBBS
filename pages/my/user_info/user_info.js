// pages/my/user_info/user_info.js
var uploadImage = require('../../../utils/uploadFile/uploadFile.js');
var util = require('../../../utils/uploadFile/util.js');
import{UserModel} from '../../../models/UserModel'
const userModel = new UserModel
import {ImageUtils} from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()
import {TopicModel} from '../../../models/TopicModel.js'
const topicModel = new TopicModel()
import { CommodityModel } from '../../../models/CommodityModel'
const commodityModel = new CommodityModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    url:'',
    uid:1,
    selected:1,
    pageNum:1,
    loading:false,
    topicList:[],
    commodityList:[],
    hasNext:false,
    bgImgUrl:'',
    isMe:false,
    isAdmin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid = options.uid
    this.setData({uid})
    if(uid == wx.getStorageSync("userInfo").id){
      this.setData({
        isMe:true
      })
    }
    userModel.getUserInfoById(uid).then(res=>{
      console.log(res)

      let tempUrl = imgUtil.getAvatarUrl(res.avatarUrl)
      let url = imgUtil.getSmallImg(tempUrl)
      let bgiurl = res.backgroundUrl
      if(bgiurl){
        let bgImgUrl = imgUtil.getBgImgUrl(bgiurl)
        this.setData({
          bgImgUrl
        })
      }else{
        let bgImgUrl = imgUtil.getLQImg(imgUtil.getBgImgUrl("default_bgi.jpg"))
        this.setData({
          bgImgUrl
        })
      }
      this.setData({
        userInfo:res,
        url
      })
    })

    topicModel.getTopicListByUid(1,uid).then(res=>{
      this.setData({
        topicList:res.list,
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
    //值刷新背景图
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
            topicList:tempList
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
  onMessage(){

    let fromuid =  this.data.uid
    let index =  10
    let obj = new Object()
    obj.fromUid = fromuid
    obj.index = index
    let strObj = JSON.stringify(obj)
    
    wx.navigateTo({
      url:'/pages/my/msg-detail/msg-detail?Obj='+strObj
    }) 


  },
  onTopic(){
    //显示该用户发的帖子
    this.setData({
      selected:1
    })

  },
  onCommodity(){
    //显示该用户发布的物品

    this.setData({
      selected:2
    })
    commodityModel.getCommodityListByUid(1,this.data.uid).then(res=>{
      this.setData({
        commodityList:res.list,
        hasNext:res.hasNextPage,
        pageNum:2
      })
    })
  },
  onChangeBGI(){
    this.onUpload()
  },
  onUpload() {
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
          canChoose: false
        })

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
          uploadImage(res.tempFilePaths[i], 'hautbbs/background/' + nowTime + "/",
            function (result) {
              let img = result.substring(65, result.length)  //相对地址，要存入数据库
              userModel.updateBackground(img).then(res => {     //如果更新成功，更新一下缓存信息
                wx.showToast({
                  title: "更改成功",
                  icon: "success",
                  duration: 500
                })
              })

              that.setData({
                bgImgUrl: tempFilePaths[0]
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