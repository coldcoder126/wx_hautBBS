// components/search/search.js

Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true
  },
  properties: {
    historyWords:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    searching:false,
    keyWord:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancel(event){
      wx.navigateBack({
        delta: 1
      })
    },
    onConfirm(event){
      this.setData({
        searching:true
      })
      const word = event.detail.value||event.detail.text
      this.setData({
        keyWord:word
      })
      this.triggerEvent('confirm',word)
      
    },
    onDelete(event){
      this.setData({
        keyWord:'',
        searching:false
      })

      this.triggerEvent('delete',{},{})
    }
    ,delHistory(event){
      this.triggerEvent('delHistory',{},{})
    }

  }
})
