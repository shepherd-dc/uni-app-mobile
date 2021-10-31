module.exports = {
	before: async (state, event) => {
		if (state.collection !== 'opendb-news-favorite' || state.type !== 'create') {
			throw new Error('非法访问')
		}
		if (state.newData.user_id !== state.auth.uid) {
			throw new Error('非法操作')
		}
	},
	after: async (state, event, error, result) => {
		if(error) {
			throw error
		}
		const db = uniCloud.database()
		await db.collection('opendb-news-articles').where({
			_id: state.newData.article_id
		}).update({
			like_count: db.command.inc(1)
		})
		return result
	}
}
