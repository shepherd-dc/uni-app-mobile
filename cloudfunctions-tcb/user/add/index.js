const db = uniCloud.database()

exports.add = async (data) => {
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
		return {
			code: 0,
			msg: '注册成功'
		}
	} else {
		return {
			code: -1,
			msg: '用户名已注册'
		}
	}

}
