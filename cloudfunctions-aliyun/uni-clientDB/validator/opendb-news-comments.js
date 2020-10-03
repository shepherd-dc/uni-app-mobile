module.exports = {
	"comment_content": {
		rules: [{
			required: true,
			errorMessage: "内容不能为空"
		}, {
			minLength: 10,
			maxLength: 10000,
			errorMessage: "内容长度需在{minLength}-{maxLength}之间"
		}]
	},
	"comment_type": {
		rules: [{
			required: true,
			errorMessage: "评论类型不能为空"
		}]
	},
	"user_id": {
		rules: [{
			required: true,
			errorMessage: "用户id不能为空"
		}],
		defaultValue: {
			$env: 'uid'
		},
	},
	"article_id": {
		rules: [{
			required: true,
			errorMessage: "文章id不能为空"
		}]
	},
	"comment_date": {
		rules: [{
			required: true,
			errorMessage: "评论时间不能为空"
		}],
		defaultValue: {
			$env: 'now'
		},
	},
	"comment_ip": {
		rules: [{
			required: true,
			errorMessage: "用户IP地址不能为空"
		}],
		defaultValue: {
			$env: 'clientIP'
		},
	},
	"reply_comment_id": {
		rules: [{
			format: 'string',
			errorMessage: "回复评论ID格式不正确"
		}]
	},
	"reply_user_id": {
		rules: [{
			format: 'string',
			errorMessage: "回复评论用户ID格式不正确"
		}]
	}
}
