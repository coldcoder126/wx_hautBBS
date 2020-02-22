// 组装图片的url

const base_url_prefix = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/'
const avatar_url_prefix = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/avatar/'
const topic_url_prefix = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/topic/'
const product_url_prefix = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/product/'
const bg_url_prefix = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/background/'

const zip_suffix = '?x-oss-process=image/resize,m_fill,h_200,w_200/quality,Q_70'
const LQ_suffix = '?x-oss-process=image/quality,Q_60'
const IMGRISK_URL = 'https://coldcoder.oss-cn-beijing.aliyuncs.com/hautbbs/system/violation.png'

class ImageUtils {
    getAvatarUrl(url) {
        //获取头像绝对路径
        return avatar_url_prefix + url
    }

    getTopicImgUrl(url) {
        //获取帖子图绝对路径
        return topic_url_prefix + url
    }

    getProductImgUrl(url) {
        //获取商品图绝对路径
        return product_url_prefix + url
    }

    getBgImgUrl(url) {
        //获取背景图绝对路径
        return bg_url_prefix + url
    }


    getSmallImg(url) {
        //生成低质量缩略图
        return url + zip_suffix
    }

    getLQImg(url) {
        //生成缩略图
        return url + LQ_suffix
    }

    getAbsUrl(strImages,subUrl){
        const list = strImages.split(";")
        let imageArray = new Array();
        for (var i = 0; i < list.length-1; i++) {
            imageArray[i] =base_url_prefix+subUrl+list[i]
        }
        return imageArray
    }

    getImgList(strImages,subUrl) {
        const list = strImages.split(";")
        let imageArray = new Array();
        for (var i = 0; i < list.length-1; i++) {
            imageArray[i] =this.getSmallImg(base_url_prefix+subUrl+list[i])
        }
        return imageArray
    }

    getLQImgList(strImages,subUrl) {
        const list = strImages.split(";")
        let imageArray = new Array();
        for (var i = 0; i < list.length-1; i++) {
            if(list[i]){
            imageArray[i] =this.getLQImg(base_url_prefix+subUrl+list[i])
            }
        }
        return imageArray
    }

    getRiskImgUrl(){
        return IMGRISK_URL
    }

}


export { ImageUtils }