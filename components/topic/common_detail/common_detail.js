// components/topic/common_detail/common_detail.js
import {ImageUtils} from '../../../utils/imageUtils'
import {imgBehave} from '../../behaviors/imgBev'
const imgUtil = new ImageUtils()
Component({
  behaviors: [imgBehave],
  /**
   * 组件的属性列表
   */
  properties: {
    TopicDetail:{
      type:Object,
      observer(){
        let imageStr = this.properties.TopicDetail.images
        if (imageStr == null || imageStr == "") {
          return
        } else {
          let imageList = imgUtil.getLQImgList(imageStr,"topic/")
          let OriginList = imgUtil.getAbsUrl(imageStr,"topic/")
          this.setData({
            image: imageList,
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
    image: [],
    OriginList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImage(e){
      let index = e.currentTarget.dataset.index
      wx.previewImage({
        current: this.data.OriginList[index],
        urls: this.data.OriginList
      })
    }
  }
})
