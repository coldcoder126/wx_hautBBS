// components/navi/navi.js
Component({
  options:{
    multipleSlots:true
},
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    first:Boolean,
    latest:Boolean
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
    onSearch:function(){
      this.triggerEvent('onSearching',{},{bubbles: true})
    }
  }
})
