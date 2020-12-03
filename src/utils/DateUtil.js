

export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}

/***
 * 列表中的日期格式化
 * @param row
 * @param column
 * @returns {*}
 */
export function dateFormat(row, column){
  let temp = row[column.property];
  if(temp == null || temp == ""){
    return "";
  }
  const createTime = formatDate(new Date(temp),"yyyy-MM-dd hh:mm:ss");
  return createTime;
}
export function getDateArr(day1, day2) {
  let getDate = function(str) {
    let tempDate = new Date();
    let list = str.split("-");
    tempDate.setFullYear(list[0]);
    tempDate.setMonth(list[1] - 1);
    tempDate.setDate(list[2]);
    return tempDate;
  }
  let date1 = getDate(day1);
  let date2 = getDate(day2);
  if (date1 > date2) {
    let tempDate = date1;
    date1 = date2;
    date2 = tempDate;
  }
  date1.setDate(date1.getDate() + 1);
  let dateArr = [];
  let i = 0;
  while (!(date1.getFullYear() == date2.getFullYear()
    && date1.getMonth() == date2.getMonth() && date1.getDate() == date2
      .getDate())) {
    let dayStr =date1.getDate().toString();
    if(dayStr.length ==1){
      dayStr="0"+dayStr;
    }
    let monthStr = (date1.getMonth() + 1).toString();
    if(monthStr.length ==1){
      monthStr="0"+monthStr;
    }
    dateArr[i] = date1.getFullYear() + "-" + monthStr + "-"
      + dayStr;
    i++;
    /*
     * document.write("<div style='display:block'>" + date1.getFullYear() +
     * "-" + (date1.getMonth() + 1) + "-" + date1.getDate() + "</div>");
     */
    // document.write(dateArr[i] + "<br>");
    date1.setDate(date1.getDate() + 1);
  }
  dateArr.splice(0,0,day1)
  dateArr.push(day2);
  return dateArr;
}
export function getDay(start,end){
  let day;
  let ss = 24 * 60 * 60 * 1000; //一天的毫秒数86400
  let startTime = new Date(start).getTime();
  let endTime = new Date(end).getTime()
  if (endTime - startTime == 0){
    day =1;
  }else{
    day = (endTime - startTime) / ss + 1
  }
  return day;
}
/**
 * 要求：如果指定毫秒ms，则必须指定全部字段； 如果指定second字段，
 * 则必须指定从year到second的所有字段；
 * 例如：不能只指定时分秒而不指定日月年。
 * 否则会出现非预期结果。这是为了程序的一致性故意设计的，
 * 使结果与当前日期没有任何关系。
 */
export function parseDate (str,fmt){
  var reg = {
    year : /(y+)/,
    month:/(M+)/,
    day:/(d+)/,
    hour:/(H+)/,
    minute:/(m+)/,
    second:/(s+)/,
    ms:/(S+)/
  };
  var date = new Date();

  var rst = reg.year.exec(fmt);
  var year = rst?+str.substr(rst.index,rst[1].length):null;
  date.setFullYear(year);

  rst = reg.month.exec(fmt);
  var month = rst?+str.substr(rst.index,rst[1].length)-1:0;
  rst = reg.day.exec(fmt);
  var day = rst?+str.substr(rst.index,rst[1].length):1;
  date.setMonth(month,day);

  rst = reg.hour.exec(fmt);
  var hour = rst?+str.substr(rst.index,rst[1].length):0;
  date.setHours(hour);

  rst = reg.minute.exec(fmt);
  var minute = rst?+str.substr(rst.index,rst[1].length):0;
  date.setMinutes(minute);

  rst = reg.second.exec(fmt);
  var second = rst?+str.substr(rst.index,rst[1].length):0;
  date.setSeconds(second);

  rst = reg.ms.exec(fmt);
  var ms = rst?+str.substr(rst.index,rst[1].length):0;
  date.setMilliseconds(ms);

  return date;
};
