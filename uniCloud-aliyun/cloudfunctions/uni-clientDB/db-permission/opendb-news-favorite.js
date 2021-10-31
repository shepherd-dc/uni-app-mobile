module.exports = {
	// 只允许查看自己的点赞信息
	'.read': 'auth.uid == doc.user_id',
	// 已由索引限制用户id+文章id唯一
	'.create': 'auth.uid != null',
	'.delete': 'auth.uid == doc.user_id && action in ["delete-favorite"]'
}