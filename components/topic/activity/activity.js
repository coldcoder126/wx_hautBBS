// components/topic/activity/activity.js
import {ImageUtils} from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()
Component({
  /**
   * 组件的属性列表
   */
  observers: {
    'Activity':function(Activity){
      let titleStr = Activity.title
      const list = titleStr.split(";")
      let img = Activity.images.split(";")
      img = img[0]
      let Origin = imgUtil.getTopicImgUrl(img)
      let image = imgUtil.getLQImg(Origin)

      this.setData({
        title:list[0],
        date:list[1],
        time:list[2],
        place:list[3],
        sponsor:list[4],
        description:Activity.content,
        image,
        Origin
      })
    }
  },
  properties: {
    Activity:Object

  },

  /**
   * 组件的初始数据
   */
  data: {
    title:"",
    date:"",
    time:"",
    place:"",
    sponsor:"",
    description:"",
    image:"",
    Origin:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImg(){
      wx.previewImage({
        current: this.data.Origin, 
        urls:[this.data.Origin]
      })
    },
    onDetail(){
      let activityDetail = JSON.stringify(this.properties.Activity)
      wx.navigateTo({
        url:'/pages/topic_detail/activity_detail/activity_detail?activityDetailStr='+activityDetail
      }) 
    },
    onRisk(error){
      let image = imgUtil.getRiskImgUrl()
      let Origin = imgUtil.getRiskImgUrl()
      this.setData({
        image,
        Origin
      })

    }

  }
})
