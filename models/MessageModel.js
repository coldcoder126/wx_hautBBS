import{
    HTTP
    }from '../utils/http.js'

    class MessageModel extends HTTP{
        send(toUid,content){
            return this.request({
                url:'message/send.do',
                data:{
                    toUid:toUid,
                    content:content
                },
                method:'POST'
              })
        }

        readAll(fromUid){
            return this.request({
                url:'message/read_all.do',
                data:{
                    fromUid:fromUid
                },
                method:'POST'
              })
        }

        getHistory(toUid,pageNum){
            return this.request({
                url:'message/get_history.do',
                data:{
                    toUid:toUid,
                    pageNum:pageNum
                },
                method:'GET'
              })
        }

        getNotification(){
            return this.request({
                url:'message/get_notification.do',
                method:'GET'
              })
        }

    }

export {MessageModel}