// 仅允许管理员写的字段
const adminWriteOnly = [
	'view_count', 
	'like_count', 
	'is_sticky', 
	'is_essence', 
	'comment_count', 
	'comment_count',
	'last_comment_user_id',
	'last_comment_user_id',
	'publish_date',
	'publish_ip',
	'last_modify_date',
	'last_modify_ip'
]

const rule = {
	// 他人及游客仅允许查看近一年的文章
	'.read': 'doc.publish_date > now - 31708800000 || auth.uid == doc.user_id',
	// 登录用户可以发布文章
	'.create': 'auth.uid != null',
	// 仅管理员可以删除文章
	'.delete': false,
	// 管理员与文章所有者可以更新
	'.update': 'auth.uid == doc.user_id'
}

for (let i = 0; i < adminWriteOnly.length; i++) {
	rule[adminWriteOnly[i]] = {
		'.write': false
	}
}

module.exports = rule
