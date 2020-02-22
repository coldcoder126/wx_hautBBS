// pages/my/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protocol:true,
    feedback:true,
    more:true,
    protocol_txt:'',
    more_txt:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.downloadFile({
      url: "https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/system/protocol.txt", 
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.getFileSystemManager().readFile({
            filePath:res.tempFilePath,
                   encoding:'utf-8',
                   success: res => {
                    that.setData({
                      protocol_txt:res.data
                    })
                    
                   },
                   fail: err=>{
                    wx.showToast({
                      title:'文件未加载',
                      icon: 'none',
                      duration: 1000
                    })
                   }
                  })
        }

      }
    })

    wx.downloadFile({
      url: "https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/system/more.txt", 
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.getFileSystemManager().readFile({
            filePath:res.tempFilePath,
                   encoding:'utf-8',
                   success: res => {
                    that.setData({
                      more_txt:res.data
                    })
                    
                   },
                   fail: console.error
                  })
        }

      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onAbout1(){
    this.setData({
      protocol:!this.data.protocol
    })
  },
  onAbout2(){
    this.setData({
      feedback:!this.data.feedback
    })
  },
  onAbout3(){
this.setData({
  more:!this.data.more
})
  }
})