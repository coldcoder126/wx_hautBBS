// components/topic/commodity_detail/commodity_detail.js
import {ImageUtils} from '../../../utils/imageUtils'
const imgUtil = new ImageUtils()
import {imgBehave} from '../../behaviors/imgBev'
Component({
  behaviors: [imgBehave],
  observers:{
    'commodityDetail':function(){
      let imageStr = this.properties.commodityDetail.images
      if (imageStr == null || imageStr == "") {
        return
      } else {
        let imageList = imgUtil.getLQImgList(imageStr,"product/")
        let OriginList = imgUtil.getAbsUrl(imageStr,"product/")
        this.setData({
          image: imageList,
          OriginList
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    commodityDetail:Object
  },

  /**
   * 组件的初始数据
   */
  data: {

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
