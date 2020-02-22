// components/upload/upload.js
const app = getApp()
var uploadImage = require('../../utils/uploadFile/uploadFile.js');
var util = require('../../utils/uploadFile/util.js');


import{ImageUtils} from '../../utils/imageUtils'
const imageUtils = new ImageUtils()

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canChoose:true,
    done:false,
    tempImgList:[],
    imgList:[]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onUpload(){
       const suburl = 'avatar'
      //  let result = uploadUtil.upload(3,suburl)
      }

    }
})
