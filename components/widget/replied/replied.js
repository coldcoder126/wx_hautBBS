// components/widget/replied/replied.js
Component({
  observers:{
    'User': function(User){
      if(User==null){
        return
      }else{
      let id = User.uid
      let nickName = User.nickName
      this.setData({
        id,
        nickName
      })
    }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    User:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    id:"",
    nickName:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLookUser(){
      let uid = this.data.id
      wx.navigateTo({
        url:'/pages/my/user_info/user_info?uid='+uid
      }) 

    }

  }
})
