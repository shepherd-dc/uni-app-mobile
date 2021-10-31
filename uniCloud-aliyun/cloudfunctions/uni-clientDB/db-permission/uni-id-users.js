// 用户表比较特殊，只有头像和用户名是公有读

const adminOnly = [
	'password',
	'mobile',
	'mobile_confirmed',
	'email',
	'email_confirmed',
	'wx_unionid',
	'wx_openid',
	'ali_openid',
	'comment',
	'realname_auth',
	'register_date',
	'register_ip',
	'last_login_date',
	'last_login_ip',
	'token',
	'inviter_uid',
	'my_invite_code',
]

// 用户表设置所有人可读，再为不可读字段设置权限
const rule = {
	'.read': true,
	'.create': false,
	'.delete': false,
	'.update': false
}

for (let i = 0; i < adminOnly.length; i++) {
	rule[adminOnly[i]] = {
		'.read': false
	}
}

module.exports = rule
