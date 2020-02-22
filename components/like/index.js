// components/like/index.js
Component({
  /**
   * 组件的对外属性列表
   */
  properties: {
    like:{
      type:Boolean
    },
    count:{
      type:Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    likeImg:"images/like.png",
    dislikeImg:"images/like@dis.png",

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLike:function(event){
      let like = this.properties.like
      let count = this.properties.count
      count = like?count-1:count+1
      this.setData({
        count:count,
        like:!like
      })
      let behavior = this.properties.like?'like':'cancel'
      this.triggerEvent('like',{
        behavior:behavior
      },{})
      //三个分别是：字符串自定义事件，两个js对象
    }

  }
})
