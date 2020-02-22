import {
  HTTP
} from '../utils/http.js'

class UserModel extends HTTP{
  getToken(wxCode){
    return this.request({
      url: 'user/get_token.do',
      data: {
        wxcode:wxCode
      }
    })
  }

  firstUpdate(nickName,gender,description,country,province,city){
    return this.request({
      url:'user/first_update.do',
      data:{
        nickName:nickName,
        gender:gender,
        description:description,
        country:country,
        province:province,
        city:city
      }
    })
  }

  updateUserInfo(nickName,gender,description,country,province,city){
    return this.request({
      url:'user/update_userinfo.do',
      data:{
        nickName:nickName,
        gender:gender,
        description:description,
        country:country,
        province:province,
        city:city
      }
    })
  }

  updateStuid(stuid){
    return this.request({
      url:'user/update_userinfo.do',
      data:{
        stuid:stuid
      }
    })
  }
  updateNickName(nickname){
    return this.request({
      url:'user/update_userinfo.do',
      data:{
        nickName:nickname
      }
    })
  }

  updateDescription(description){
    return this.request({
      url:'user/update_userinfo.do',
      data:{
        description:description
      }
    })
  }

  updateNicknameAndDescp(nickname,description){
    return this.request({
      url:'user/update_userinfo.do',
      data:{
        nickName:nickname,
        description:description
      }
    })
  }

  getUserInfo(){
    return this.request({
      url:'user/get_info.do'
    })
  }

  updateAvatar(url){
    return this.request({
      url:'user/update_avatar.do',
      data:{
        avatarUrl:url
      }
    })
  }

  updateBackground(url){
    return this.request({
      url:'user/update_background.do',
      data:{
        backgroundUrl:url
      }
    })
  }

  getUserInfoById(id){
    return this.request({
      url:'user/get_userById.do',
      data:{
        id:id
      }
    })
  }

  sign(score){
    return this.request({
      url:'user/sign.do',
      data:{
        score:score
      }
    })
  }

  getPhoneNumber(encryptedData,KeyorCode,iv){
    return this.request({
      url:'user/update_phone.do',
      data:{
        encryptedData:encryptedData,
        KeyorCode:KeyorCode,
        iv:iv
      }
    })
  }

}

export {UserModel}