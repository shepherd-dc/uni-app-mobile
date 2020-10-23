<template>
	<view class="article-detail">
		<view class="title">{{ detail.title }}</view>
		<view class="info">
		  <text class="author">喜虫育儿</text>
		  <text class="time">{{ detail.create_time }}</text>
		</view>
		<view class="ql-snow">
			<view class="ql-editor">
				<rich-text class="detail-content" :nodes="detail.content"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
import { getArticle } from '@/service/articles'
import { getDate } from '@/utils/datetime'
export default {
	onLoad(query) {
		this.id = query.params
	},
	onShow () {
		this.getArticle()
	},
	data () {
		return {
			detail: {},
			id: ''
		}
	},
	methods: {
		async getArticle () {
			const { result } = await getArticle(this.id)
			console.log('getArticle', result)
			const { data } = result
			if (data.length) {
				const article = data[0]
				article.create_time = getDate(article.create_time, 'year')
				this.detail = article
			}
		}
	}
}
</script>

<style lang="less" scoped>
	@import '~@/static/css/editorNex.snow.css';
	.article-detail {
		padding: 20rpx;
		width: 100%;
	}
	.title {
		font-weight: bold;
		text-align: center;
		margin-bottom: 10px;
		padding-bottom: 8px;
		border-bottom: 1px solid #F2F2F2;
	}
	.info {
		text-align: center;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20px;
		.author {
			margin-right: 20px;
		}
	}
	.detail-content {
		font-size: 30rpx;
		color: #333;
	}
	/deep/.ql-editor {
		padding: 0;
	}
</style>
