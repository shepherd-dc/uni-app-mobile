module.exports = {
	"title": {
		rules: [{
			required: true,
			errorMessage: "标题不能为空"
		}, {
			minLength: 2,
			maxLength: 20,
			errorMessage: "标题长度需在{minLength}-{maxLength}之间"
		}]
	},
	"content": {
		rules: [{
			required: true,
			errorMessage: "内容不能为空"
		}, {
			minLength: 10,
			maxLength: 14000,
			errorMessage: "内容长度需在{minLength}-{maxLength}之间"
		}]
	},
	"user_id": {
		rules: [{
			required: true,
			errorMessage: "标题不能为空"
		}],
		forceDefaultValue: {
			$env: 'uid'
		},
	},
	"publish_date": {
		rules: [{
			required: true,
			errorMessage: "发布时间不能为空"
		}],
		forceDefaultValue: {
			$env: 'now'
		},
	},
	"like_count": {
		rules: [{
			required: true,
			errorMessage: "点赞数量为必传项"
		}],
		forceDefaultValue: 0
	}
}
