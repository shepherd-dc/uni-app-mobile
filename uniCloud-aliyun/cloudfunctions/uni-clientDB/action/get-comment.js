module.exports = {
	after: async (state, event, error, result) => {
		return {
			data: result.data.map(comment => {
				const userList = comment.userList
				delete comment.userList
				comment.userInfo = userList.find(item => item._id === comment.user_id)
				comment.replyUserInfo = userList.find(item => item._id === comment.reply_user_id)
				return comment
			})
		}
	}
}
