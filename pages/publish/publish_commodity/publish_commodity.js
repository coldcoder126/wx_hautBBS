// pages/publish/publish_commodity/publish_commodity.js
const app = getApp()
var uploadImage = require('../../../utils/uploadFile/uploadFile.js');
var util = require('../../../utils/uploadFile/util.js');
import{CommodityModel} from '../../../models/CommodityModel'
const commodityModel = new CommodityModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canChoose:true,
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

 onSubmit(event){
   wx.showLoading({
      title: '正在发布',
      mask:true
    })

   // console.log("来自form")
   // console.log(event.detail.value)
   let title = event.detail.value.title
   let description = event.detail.value.description
   let price = event.detail.value.price
   let imgs = this.data.images

   var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

   //1.校验内容2.校验价格
if(description.trim()<2){
   wx.showToast({
      title: "请确保内容有意义",
      icon: "none",
      duration: 1500
    })
}else if(!reg.test(price.toString())){
   wx.showToast({
      title: "请输入正确金额",
      icon: "none",
      duration: 1500
    })
}else{
   commodityModel.publishCommodity(title,description,imgs,price).then(res=>{
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
  },
  fail=>{
    console.log("失败")
  }
  )
}

 },
onUpload(){
  let that = this
      wx.chooseImage({
         count: 3, // 默认最多一次选择3张图
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            var nowTime = util.formatTime(new Date());

            that.setData({
              canChoose:false
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
               uploadImage(res.tempFilePaths[i], 'hautbbs/product/'+ nowTime +"/",
                  function (result) {
                     let imgs = new String(that.data.images)
                    that.setData({
                      tempFilePaths,
                        images:imgs = imgs.concat(result.substring(62,result.length).concat(";"))  //相对地址，要存入数据库
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