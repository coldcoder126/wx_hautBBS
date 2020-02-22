// components/comment/main_comment/comment.js
Component({
  observers: {
    'Comment':function(Comment){
      let result= new Array()
      result.push(Comment.fromUser.uid)
      result.push(Comment.fromUser.nickName)
      if(Comment.parentId>0){
        //如果父评论大于0，说明其为二级评论，和将要发布的评论共用一个parentId。
        //否则当前被点击的评论为将要发布评论的父评论
      result.push(Comment.parentId)
      }else{
        result.push(Comment.id)
      }

     this.setData({
       result
     })
    }
  },
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    Comment:Object,
    More:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 将目标用户的id,nickName,该评论的parentId组成List传过去
    result:[],
    more:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onReply(){
      this.triggerEvent("reply",this.data.result,{})
    },
    onSubReply(event){
      this.triggerEvent("reply",event.detail,{})
    },
    seeMore(){
      this.onReply()
      this.setData({
        more:true
      })
    },
    onClose(){
      this.setData({
        more:false
      })

      this.triggerEvent("owner")
    }

  }
})
