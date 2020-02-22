import{
  HTTP
  }from '../utils/http.js'

  class TopicModel extends HTTP{
    getTopicList(pageNum,topicType){
      return this.request({
        url:'topic/get_topiclist.do',
        data:{
          pageNum:pageNum,
          pageSize:10,
          topicType:topicType
        },
        method:'GET'
      })
    }

    

    searchTopic(pageNum,keyWord,type){
      return this.request({
        url:'topic/search.do',
        data:{
          key:keyWord,
          type:type,
          pageNum:pageNum,
          pageSize:10
        },
        method:'GET'
      })
    }

    getTopicVoByid(id){
      return this.request({
        url:'topic/get_topicbyid.do',
        data:{
          id:id
        },
        method:'GET'
      })
    }

    publishCommon(title,content,images,type){
      return this.request({
        url:'topic/publish_topic.do',
        data:{
          title:title,
          content:content,
          images:images,
          topicType:type,
          isAnon:false,
          isCommentable:true
        },
        method:'POST'
      })
    }

    getTopicListByUid(pageNum,uid){
      return this.request({
        url:'topic/get_topicListByUid.do',
        data:{
          pageNum:pageNum,
          pageSize:10,
          UID:uid
        },
        method:'GET'
      })
    }



    deleteTopic(topicId){
      return this.request({
        url:'topic/delete_topic.do',
        data:{
          topicId:topicId
        },
        method:'POST'
      })
    }

  }

  export{TopicModel}