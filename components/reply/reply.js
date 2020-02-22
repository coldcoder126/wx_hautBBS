// components/reply/reply.js
import{CommentModel} from '../../models/CommentModel'
const commentModel = new CommentModel()

Component({
  lifetimes: {
    attached: function() {
      const appInstance = getApp()
      let hasLogin = appInstance.globalData.hasLogin
      if(!hasLogin){
        this.setData({
          disabled:true,
          Value:'请先登录'
        })
      }
      let avatarUrl = wx.getStorageSync("avatarUrl")
      if(avatarUrl){
      this.setData({
        avatarUrl
      })
    }else{
      this.setData({
        disabled:true
      })
    }
    }
  },
  observers: {
    'result':function(){
      console.log(this.properties.result)
      if(this.properties.result[2]>0){
      this.setData({
        level:2,
        focused:true
      })
    }
    },
    'value':function(value){
      this.setData({
        Value:value
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    result:Array,
    topicId:Number,
    value:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    level:1,
    content:"",
    avatarUrl:"",
    Value:"",
    focused:false,
    disabled:false
  },

  /**
   * 组件的方法列表
   * result[uid,nickName,parentid,level,text] 传到page页面
   */
  methods: {
    onReply(event){
      let input = event.detail.value.reply
      if(input==null||input.trim().length==0){

      }else{
             let res = new Array()
      res.push(this.properties.result[0])
      res.push(this.properties.result[1])
      res.push(this.properties.result[2])
      res.push(this.data.level)
      res.push(input)
      this.triggerEvent("sending",res)
      }
      
    },
    onBack(e){
      const appInstance = getApp()
      let hasLogin = appInstance.globalData.hasLogin
      if(!hasLogin){
        this.setData({
          disabled:true,
          Value:'请先登录'
        })
        wx.showToast({
          title: "请先登录",
          icon: "none",
          duration: 1500
        })
      }else if(wx.getStorageSync("userInfo").status>0)
      {
        wx.showToast({
          title: "你已被禁言",
          icon: "none",
          duration: 1500
        }) 
      }else{
      this.setData({
        focused:false
      })
      this.triggerEvent("back",{},{})
      }
    }


  }
})
