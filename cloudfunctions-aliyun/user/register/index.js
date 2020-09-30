'use strict';
const validator = require('validator')
const { getVersion, successCode, failCode } = require('validate')
const version = getVersion()

const db = uniCloud.database()

function validateEmail (email) {
	return validator.isEmail(email)
}

exports.register = async (data) => {
	const collection = db.collection('user')
	const user = await collection.where({
		username: data.username
	}).get()
        
	if (user.data.length < 1) {
		const res = await collection.add({
			username: data.username,
			password: data.password,
			email: data.email
		})
		console.log(res) // eslint-disable-line
		return {
			code: successCode,
			msg: '注册成功',
			data: {
				version,
				email: validateEmail(data.email)
			}
		}
	} else {
		return {
			code: failCode,
			msg: '用户名已注册'
		}
	}

}
