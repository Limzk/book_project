export function parseTime(val) {
    var parseDate = new Date()
    parseDate.setTime(val)
    var year = parseDate.getFullYear(); 
    var month = parseDate.getMonth()+1; 
    var date = parseDate.getDate(); 
    var hour = addZero(parseDate.getHours()) 
    var minute = addZero(parseDate.getMinutes()) 
    var second = addZero(parseDate.getSeconds())
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second; 
}
// 加0
function addZero (number) {
    return number.toString().padStart(2,0)
}