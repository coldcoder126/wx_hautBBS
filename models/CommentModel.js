import{
    HTTP
    }from '../utils/http.js'

class CommentModel extends HTTP{
    // 传递帖子的id以获取此贴下所有评论
    getAllComments(tid,pagenum){
        return this.request({
            url:'topicComment/get_comment.do',
            data:{
              pageNum:pagenum,
              pageSize:10,
              topicId:tid
            },
            method:'GET'
        })
    }

    publishComment(topicId,toUid,content,level,parentId){
        return this.request({
            url:'topicComment/publish_comment.do',
            data:{
                topicId:topicId,
                toUid:toUid,
                content:content,
                level:level,
                parentId:parentId
            },
            method:'POST'
        })
    }

    getTopicNotification(pageNum){
        return this.request({
            url:'topicComment/get_notification.do',
            data:{
                pageNum:pageNum
            },
            method:'POST'
        })
    }

    readAllTopicNitification(){
        return this.request({
            url:'topicComment/readAll.do',
            method:'POST'
        })
    }

    getCommentsFromMe(pageNum){
        return this.request({
            url:'topicComment/get_CommentsFromMe.do',
            data:{
                pageNum:pageNum
            },
            method:'GET'
        })
    }

    deleteComment(commentId){
        return this.request({
            url:'topicComment/delete_comment.do',
            data:{
                commentId:commentId
            },
            method:'POST'
        })
    }

// -----------------------以下是商品评论--------------------------- \\

    getCommodityComments(pid,pagenum){
        return this.request({
            url:'productComment/get_list.do',
            data:{
              pageNum:pagenum,
              pageSize:10,
              productId:pid
            },
            method:'GET'
        })

    }
    publishCommodityComment(productId,toUid,content,level,parentId){
        return this.request({
            url:'productComment/publish.do',
            data:{
                productId:productId,
                toUid:toUid,
                content:content,
                level:level,
                parentId:parentId
            },
            method:'POST'
        })
    }

    getCommodityNotification(pageNum){
        return this.request({
            url:'productComment/get_notification.do',
            data:{
                pageNum:pageNum
            },
            method:'POST'
        })
    }

    readAllCommodityNotification(){
        return this.request({
            url:'productComment/readAll.do',
            method:'POST'
        })
    }

}

export{CommentModel}