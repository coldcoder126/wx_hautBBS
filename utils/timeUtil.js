
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()

class TimeUtil {


    isToday(time) {
        if(!time){return true}
        let signTime = new Date(parseInt(time))
        let _year = signTime.getFullYear()
        let _month = signTime.getMonth()
        let _day = signTime.getDate()
        console.log(year)
        console.log(_year)
        console.log(day)
        console.log(_day)
        
        if(year==_year&&month==_month&&day==_day){      //如果是今天返回rtrue
            return true
        }else{
            return false
        }
    }
}


export { TimeUtil }