import { getDate } from '@/utils/datetime'
import { getArticles } from '@/service/articles'

import { db, dbCmd } from '@/utils/request'
const $ = dbCmd.aggregate

export function getVaccine (id) {
	return db.collection('vaccines').doc(id).get()
}

export async function aggregateGetVaccine (id) {
	let result = {}
	if (!id) return result
	let links = []
	let articles = []
	const detail = await getVaccine(id)
	const { data: detailData } = detail.result
	if (detailData.length) {
		const detail = detailData[0]
		links = detail.links || []
		result = Object.assign({}, detail)
	}
	const articlesResult = await getArticles(links)
	const { data: articlesData } = articlesResult.result
	if (articlesData.length) {
		articles = articlesData
	}
	result.articles = articles
	return result
}