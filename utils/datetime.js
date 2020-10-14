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
export const getDate = (timeStamp = Date.now(), startType = 'date') => {
	const d = new Date(timeStamp)
	const year = d.getFullYear()
	const month = getHandledValue(d.getMonth() + 1)
	const date = getHandledValue(d.getDate())
	const hours = getHandledValue(d.getHours())
	const minutes = getHandledValue(d.getMinutes())
	const second = getHandledValue(d.getSeconds())
	let resStr = ''
	if (startType === 'year') resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
	else if (startType === 'date') resStr = year + '年' + month + '月' + date + '日'
	else resStr = month + '-' + date + ' ' + hours + ':' + minutes
	return resStr
}

export function getSimpleDate(type) {
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