import{
    HTTP
    }from '../utils/http.js'
    class SearchModel extends HTTP{

        searchTopic(type,keyword,start){
            return this.search({
                url:'topic_core/select',
                data:{
                    fl:"*",
                    fq:'topicType:'+type,
                    q:'keyword:'+keyword,
                    rows:10,
                    sort:"createTime desc",
                    start:start
                }

            })
        }

        searchCommodity(keyword,start){
            return this.search({
                url:'product_core/select',
                data:{
                    fl:"*",
                    q:'keyword:'+keyword,
                    rows:10,
                    sort:"createTime desc",
                    start:start
                }

            })
        }
    }

    export {SearchModel}
