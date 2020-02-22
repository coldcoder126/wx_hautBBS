import {
    HTTP
  } from '../utils/http.js'

class AdminModel extends HTTP{
    adminLogin(account,password){
        return this.request({
            url: 'admin/loginFromWeChat.do',
            data: {
              account:account,
              password:password
            }
          })
    }

    deleteTopic(tid){
        return this.request({
            url: '/manage/topic_product/delete_topic_from_wx.do',
            data: {
              id:tid
            }
          })
    }

    deleteCommodity(cid){
        return this.request({
            url: '/manage/topic_product/delete_product_from_wx.do',
            data: {
              id:cid
            }
          })
    }

    noticeOwner(touid,msg){
        return this.request({
            url: '/manage/topic_product/notice_from_wx.do',
            data: {
              toUid:touid,
              msg:msg
            }
          })
        
    }
}

export {AdminModel}

