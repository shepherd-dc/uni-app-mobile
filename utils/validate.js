import app from '../main.js'

/**
 * 简单表单验证公共方法
 * @param {String} key 验证字段
 * @param {Object} rules 正则规则
 * @param {Object} form 表单对象
 */
function validate (key, rules, form) {
	let bool = true
	if (!rules[key].rule.test(form[key])) {
		app.$toast(rules[key].msg)
		bool = false
	}
	return bool
}

export default validate
