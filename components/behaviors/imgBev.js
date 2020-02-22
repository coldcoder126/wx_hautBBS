import {ImageUtils} from '../../utils/imageUtils'
const imgUtil = new ImageUtils()
const imgBehave = Behavior({
data:{
    image: [],
    OriginList:[]
},
methods:{
    onRisk(error){
        let i = error.currentTarget.dataset.index
        let image = this.data.image
        let OriginList = this.data.OriginList
        OriginList[i] = imgUtil.getRiskImgUrl()
        image[i] = imgUtil.getRiskImgUrl()
        this.setData({
          image,
          OriginList
        })

      }
}
})

export {imgBehave}