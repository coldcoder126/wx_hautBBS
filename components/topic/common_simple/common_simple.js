// components/topic/common_simple/common_simple.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    SimpleTopic:Object
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
    onDetail(){
        let TopicDetail = JSON.stringify(this.properties.SimpleTopic)
      if(this.data.SimpleTopic.topicType<3){

      wx.navigateTo({
        url:'/pages/topic_detail/common_detail/common_detail?topicDetailStr='+TopicDetail
      }) 
    }else{
      wx.navigateTo({
        url:'/pages/topic_detail/activity_detail/activity_detail?activityDetailStr='+TopicDetail
      }) 
    }
    }

  }
})
