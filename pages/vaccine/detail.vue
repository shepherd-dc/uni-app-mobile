<template>
  <view class="detail">
    <view class="detail-title">
      <view class="title-main">
        <text
          :class="{'self-pay': detail.type === 1}"
          class="type">{{ detail.type === 1 ? '自费' : '免费' }}</text>
        <text class="name">{{ detail.name }}</text>
      </view>
      <view class="description">{{ detail.description }}</view>
    </view>
    <xc-card
      :content="detail.introduction"
      title="简介"/>
    <xc-card
      :content="detail.ages"
      title="接种时间"/>
    <xc-card
      :content="detail.taboos"
      title="接种禁忌"/>
    <xc-card
      :content="detail.precautions"
      title="注意事项"/>
    <xc-card
      :content="detail.reactions"
      title="接种反应"/>
    <xc-card title="链接文章">
      <view
        v-for="(art, i) in detail.articles"
        :key="art._id"
        class="article">
        <text
          class="article-item"
          @click="toArticleDetail(art._id)">{{ `${i + 1}. ${art.title}` }}</text>
      </view>
    </xc-card>
  </view>
</template>

<script>
import { aggregateGetVaccine } from '@/service/vaccines'
export default {
  onLoad (query) {
    this.id = query.params
  },
  onShow () {
	  this.getVaccine()
  },
  data () {
    return {
      detail: {},
      id: ''
    }
  },
  methods: {
	  async getVaccine () {
	    const result = await aggregateGetVaccine(this.id)
	    console.log('aggregateGetVaccine', result)
	    result.type != null && (result.type = +result.type === 1 ? '自费' : '免费')
	    this.detail = result
	  },
    toArticleDetail (id) {
      this.$navigateTo('/article/article?params=' + id)
    }
  }
}
</script>

<style lang="less" scoped>
	.detail {
		width: 100%;
		height: 100%;
		background-color: #f8f8f8;
	}
	.detail-title {
		// display: flex;
		// flex-wrap: wrap;
		background-color: #fff;
		padding: 20rpx;
		margin-bottom: 10rpx;
		.type {
			background-color: #56ceab;
			border-radius: 20rpx;
			color: #fff;
			font-size: 26rpx;
			padding: 2rpx 20rpx;
			margin-right: 20rpx;
		}
		.type.self-pay {
			background-color: #f7647e;
		}
		.name {
			// margin-right: 20rpx;
			font-weight: bold;
		}
		.description {
			margin-top: 20rpx;
			color: #888;
			font-size: 30rpx;
			padding-left: 10rpx;
			line-height: 1.8;
		}
	}
	.article-item {
		color: #2d8cf0;
	}
</style>
