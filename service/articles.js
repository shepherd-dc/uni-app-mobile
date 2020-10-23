import { getDate } from '@/utils/datetime'
import { db, dbCmd } from '@/utils/request'

export function getArticle (id) {
	return db.collection('opendb-news-articles').where(
		{
			_id: id,
			create_time: dbCmd.gt(Date.now() - 365 * 24 * 3600000)
		}
	)
	.get()
}

export function getArticles (ids) {
	return db.collection('opendb-news-articles').where(
		{
			_id: dbCmd.in(ids),
			create_time: dbCmd.gt(Date.now() - 365 * 24 * 3600000)
		}
	)
	.field({
		_id: 1,
		title: 1
	})
	.get()
}
