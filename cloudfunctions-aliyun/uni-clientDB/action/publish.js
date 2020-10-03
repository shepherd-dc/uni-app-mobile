module.exports = {
	before: async (state, event) => {
		if (state.collection !== 'opendb-news-articles' || state.type !== 'create') {
			throw new Error('非法访问')
		}
	}
}
