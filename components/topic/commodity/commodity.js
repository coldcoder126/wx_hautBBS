// components/topic/commodity/commodity.js
import {ImageUtils} from '../../../utils/imageUtils'
import {imgBehave} from '../../behaviors/imgBev'
const imgUtil = new ImageUtils()
Component({
  behaviors: [imgBehave],
  observers: {
    'Commodity':function(){
      let imageStr = this.properties.Commodity.images
      if (imageStr == null || imageStr == "") {
        return
      } else {
        let imageList = imgUtil.getImgList(imageStr,"product/")
        let OriginList = imgUtil.getAbsUrl(imageStr,"product/")
        this.setData({
          image: imageList,
          hasImage: true,
          OriginList
        })
      }
    }
  },
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    Commodity:Object

  },

  /**
   * 组件的初始数据
   */
  data: {
    hasImage: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDetail(){
      let CommodityDetail = JSON.stringify(this.properties.Commodity)
      // 直接携带参数跳转到指定页面
      wx.navigateTo({
        url:'/pages/topic_detail/commodity_detail/commodity_detail?commodityDetailStr='+CommodityDetail
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
