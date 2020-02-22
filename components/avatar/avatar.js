// components/avatar/avatar.js
import {ImageUtils} from '../../utils/imageUtils'
const imgUtil = new ImageUtils()

Component({
  observers:{
    'User': function(User){
      if(User==null){
        return
      }else{
      let url = User.avatarUrl
      let tempUrl = imgUtil.getAvatarUrl(url)
      let id = User.uid
      url = imgUtil.getSmallImg(tempUrl)
      this.setData({
        url,
        id
      })
    }
    },
    'Sub':function(Sub){
      if(Sub){
        this.setData({
          length:50,
          sub:true
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    Time:String,
    User:Object,
    Sub:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    url: "",
    id:"",
    length:70,
    sub:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLookUser(){
      let uid = this.data.id
      wx.navigateTo({
        url:'/pages/my/user_info/user_info?uid='+uid
      }) 

    },
    onRisk(error){
      let url = imgUtil.getRiskImgUrl()
      this.setData({
        url
      })

    }
  
  }
})
