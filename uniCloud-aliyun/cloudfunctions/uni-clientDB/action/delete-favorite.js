module.exports = {
	before: async (state, event) => {
		if (state.collection !== 'opendb-news-favorite' || state.type !== 'delete') {
			throw new Error('非法访问')
		}
	},
	after: async (state, event, error, result) => {
		const db = uniCloud.database()
		if (result.deleted) {
			await db.collection('opendb-news-articles').where({
				_id: state.command.getParam({
					name: 'where'
				})[0].article_id
			}).update({
				like_count: db.command.inc(-1)
			})
		}
		return result
	}
}
