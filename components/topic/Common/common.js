// components/topic/Common/common.js
import {ImageUtils} from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()
import {imgBehave} from '../../behaviors/imgBev'
Component({
  behaviors: [imgBehave],
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    topic: {
      type: Object,
      observer() {
        let imageStr = this.properties.topic.images
        if (imageStr == null || imageStr == "") {
          return
        } else {
          let imageList = imgUtil.getImgList(imageStr,"topic/")
          let OriginList = imgUtil.getAbsUrl(imageStr,"topic/")
          this.setData({
            image: imageList,
            hasImage: true,
            OriginList
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // image: [],
    hasImage: false,
    // OriginList:[]

  },


  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event) {
      let TopicDetail = JSON.stringify(this.properties.topic)
      // 直接携带参数跳转到指定页面
      wx.navigateTo({
        url:'/pages/topic_detail/common_detail/common_detail?topicDetailStr='+TopicDetail
      }) 
    },
    onPreview(e){
      let i = e.currentTarget.dataset.index
      wx.previewImage({
        current: this.data.OriginList[i],
        urls:this.data.OriginList 
      })
    }
  }


})
