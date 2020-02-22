// components/comment/sub_comment/sub_comment.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ChildComments:Object,
    ToUid:Number,
    Level:Number
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
    onReply(event){
      let result = event.detail
      this.triggerEvent("reply",result,{})
    }

  }
})
