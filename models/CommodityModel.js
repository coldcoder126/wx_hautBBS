import {
    HTTP
} from '../utils/http.js'

class CommodityModel extends HTTP {
    getCommodityList(pageNum) {
        return this.request({
            url: 'product/get_list.do',
            data: {
                pageNum: pageNum,
                pageSize: 10
            },
            method: 'GET'
        })

    }

    publishCommodity(title, description, images, price) {
        return this.request({
            url: 'product/publish.do',
            data: {
                title: title,
                description: description,
                images: images,
                price: price
            },
            method: 'POST'
        })
    }

    searchCommodity(keyword,pagenum){
        return this.request({
            url: 'product/search.do',
            data: {
                key:keyword,
                pageNum:pagenum,
                pageSize:10
            },
            method: 'GET'
        })

    }

    getCommodityVoById(id){
        return this.request({
            url:'product/get_commodityById.do',
            data:{
              id:id
            },
            method:'GET'
          })
    }

    getCommodityListByUid(pageNum,uid){
        return this.request({
          url:'product/get_ProductListByUid.do',
          data:{
            pageNum:pageNum,
            pageSize:10,
            UID:uid
          },
          method:'GET'
        })
      }

      setSaled(commodityId){
        return this.request({
            url:'product/set_saled.do',
            data:{
                productId:commodityId
            },
            method:'POST'
          })
      }

      deleteCommodity(commodityId){
        return this.request({
            url:'product/delete_product.do',
            data:{
                productId:commodityId
            },
            method:'POST'
          })
      }
      


}

export { CommodityModel }