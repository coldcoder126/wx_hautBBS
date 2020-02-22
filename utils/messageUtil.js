

class messageUtil {
    msgCache = 'msgUserList'
    maxLength = 20

    //传入一个消息对象，判断本地消息缓存中是否有来自此人的消息，如果有，更新；
    //如果没有，查找此人的信息，然后更新缓存
    //[id,头像url,是否已读，最后一条消息]

    updateCache(msgObj) {
        var tempMsgList = this.getCache()
        let tempFromUidList = new Array()

        console.log(tempMsgList)
        for (let i = 0; i < tempMsgList.length; i++) {
            tempFromUidList.push(tempMsgList[i].fromUid)
        }

        let index = tempFromUidList.indexOf(msgObj.fromUid)
        if (index > -1) {        //说明传入的聊天对象缓存中有，就更新该缓存
            let tempObj = new Object()
            tempObj.fromUid = msgObj.fromUid
            tempObj.avatarUrl = tempMsgList[index].avatarUrl
            tempObj.haveRead = false
            tempObj.message = msgObj.content

            tempMsgList.splice(index, 1)                     //删除缓存中的该条数据，unshift一个新的对象，更新缓存
            tempMsgList.unshift(tempObj)
            wx.setStorageSync(this.msgCache, tempMsgList)
        } else {                                           //缓存中没有该聊天对象信息,头像使用someone.png，组装，
            let tempObj = new Object()
            tempObj.fromUid = msgObj.fromUid
            tempObj.avatarUrl = "images/someone.png"
            tempObj.haveRead = false
            tempObj.message = msgObj.content

            if (tempMsgList.length > this.maxLength) {
                tempMsgList.pop()
            }
            tempMsgList.unshift(tempObj)
            wx.setStorageSync(this.msgCache, tempMsgList)
        }
    }

    getCache() {
        const list = wx.getStorageSync(this.msgCache)
        if (!list) {
            return []
        } else {
            return list
        }
    }

    setCache(value){
        if(!value){
            return
        }else{
            wx.setStorageSync(this.msgCache,value)
        }
    }


}

export{messageUtil}