class SearchHistory{

    topicHistory="topic_search_history"
    commodityHistory="commdity_search_history"

    maxLength = 8;

    getTopicHistory() {
        const keyWords = wx.getStorageSync(this.topicHistory);
        if (!keyWords) {
          return [];
        }
        return keyWords;
      }

      addTotopicHistory(keyword) {
        if (!keyword) return;
        var keyWords = this.getTopicHistory();
        const has = keyWords.includes(keyword);
        if (!has) {
          const lenght = keyWords.length;
          if (lenght >= this.maxLength) {
            keyWords.pop();
          }
          keyWords.unshift(keyword);
          wx.setStorageSync(this.topicHistory, keyWords)
        }
      }

      getCommodityHistory() {
        const keyWords = wx.getStorageSync(this.commodityHistory);
        if (!keyWords) {
          return [];
        }
        return keyWords;
      }

      addTocommodityHistory(keyword) {
        if (!keyword) return;
        var keyWords = this.getCommodityHistory();
        const has = keyWords.includes(keyword);
        if (!has) {
          const lenght = keyWords.length;
          if (lenght >= this.maxLength) {
            keyWords.pop();
          }
          keyWords.unshift(keyword);
          wx.setStorageSync(this.commodityHistory, keyWords)
        }
      }


}

export{SearchHistory}