/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
	return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
export const getDate = (timeStamp = Date.now(), startType = 'date', split = '-') => {
	const d = new Date(timeStamp)
	const year = d.getFullYear()
	const month = getHandledValue(d.getMonth() + 1)
	const date = getHandledValue(d.getDate())
	const hours = getHandledValue(d.getHours())
	const minutes = getHandledValue(d.getMinutes())
	const second = getHandledValue(d.getSeconds())
	let resStr = ''
	if (startType === 'year') resStr = year + split + month + split + date + ' ' + hours + ':' + minutes + ':' + second
	else if (startType === 'date') resStr = year + '年' + month + '月' + date + '日'
	else resStr = month + split + date + ' ' + hours + ':' + minutes
	return resStr
}

export function getSimpleDate (type) {
	const date = new Date()
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	if (type === 'start') {
		year = year - 60
	} else if (type === 'end') {
		year = year + 2
	}
	month = month > 9 ? month : '0' + month
	day = day > 9 ? day : '0' + day
	return `${year}-${month}-${day}`
}

export function getMonthAddedDate (currentDate, addMonth) {
	let addDay = 0
	let addedDate
	currentDate = new Date(currentDate) // 将日期格式转换为 Mon Apr 01 2019 08:00:00 GMT+0800 (中国标准时间)
	if (parseInt(addMonth) < parseFloat(addMonth)) { // 小数的情况：1.5月
		addDay = addMonth * 30
		addedDate = currentDate.setDate(currentDate.getDate() + addDay) // 输出日期格式为毫秒形式
	} else {
		addedDate = currentDate.setMonth(currentDate.getMonth() + addMonth)
	}
	addedDate = new Date(addedDate)
	
	const year = addedDate.getFullYear()
	const month = getHandledValue(addedDate.getMonth() + 1) // 因日期中的月份表示为0-11，所以要显示正确的月份，需要 + 1
	const day = getHandledValue(addedDate.getDate()) 
	return `${year}年${month}月${day}日`
}
